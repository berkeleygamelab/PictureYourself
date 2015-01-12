#include "highgui.hpp"
#include "imgproc.hpp"
#include <iostream>
#include <sys/types.h>
#include <sys/stat.h>

//PLATFORM
#define MAC 0
#define LINUX 1

#define EXIT 0 
#define RECT 1
#define BKGDFRGD 2
#define DEBUG 1
#define CROP 1


using namespace std;
using namespace cv;

static void help()
{
    cout << "\nThis program demonstrates GrabCut segmentation -- select an object in a region\n"
    "and then grabcut will attempt to segment it out.\n"
    "Call:\n"
    "./grabcut <image_name>\n"
    "\nSelect a rectangular area around the object you want to segment\n" <<
    "\nHot keys: \n"
    "\tESC - quit the program\n"
    "\tr - restore the original image\n"
    "\tn - next iteration\n"
    "\n"
    "\tleft mouse button - set rectangle\n"
    "\n"
    "\tCTRL+left mouse button - set GC_BGD pixels\n"
    "\tSHIFT+left mouse button - set CG_FGD pixels\n"
    "\n"
    "\tCTRL+right mouse button - set GC_PR_BGD pixels\n"
    "\tSHIFT+right mouse button - set CG_PR_FGD pixels\n" << endl;
}

const Scalar RED = Scalar(0,0,255);
const Scalar PINK = Scalar(230,130,255);
const Scalar BLUE = Scalar(255,0,0);
const Scalar LIGHTBLUE = Scalar(255,255,160);
const Scalar GREEN = Scalar(0,255,0);

const int BGD_KEY = CV_EVENT_FLAG_CTRLKEY;
const int FGD_KEY = CV_EVENT_FLAG_SHIFTKEY;

//suffix variables
const string suffix = "_grabcut.";
const string alphasuffix = "_sticker";
const string fileext = ".png";
const string savepath = "public/users/";

static void getBinMask( const Mat& comMask, Mat& binMask )
{
    if( comMask.empty() || comMask.type()!=CV_8UC1 )
        CV_Error( CV_StsBadArg, "comMask is empty or has incorrect type (not CV_8UC1)" );
    if( binMask.empty() || binMask.rows!=comMask.rows || binMask.cols!=comMask.cols )
        binMask.create( comMask.size(), CV_8UC1 );
    binMask = comMask & 1;
}

class GCApplication
{
public:
    enum{ NOT_SET = 0, IN_PROCESS = 1, SET = 2 };
    static const int radius = 2;
    static const int thickness = -1;
    
    void reset();
    void clearRect();
    void constructor();
    void autoRect(int x, int y, int width, int height, string filepath, string useruid);
    void setImageAndWinName( const Mat& _image, const string& _winName );
    void showImage() const;
    void mouseClick( int event, int x, int y, int flags, void* param );
    void doRectangle(char** argv);
    int nextIter();
    int getIterCount() const { return iterCount; }
  
private:
    void setRectInMask();
    void setLblsInMask( int flags, Point p, bool isPr );
    
    const string* winName;
    const Mat* image;
    Mat mask;
    Mat bgdModel, fgdModel;
    
    uchar rectState, lblsState, prLblsState;
    bool isInitialized;
    
    Rect rect;
    vector<Point> fgdPxls, bgdPxls, prFgdPxls, prBgdPxls;
    int iterCount;
};

void GCApplication::reset()
{
    if( !mask.empty() )
        mask.setTo(Scalar(255,255,255,255));//GC_BGD));
    bgdPxls.clear(); fgdPxls.clear();
    prBgdPxls.clear();  prFgdPxls.clear();
    
    isInitialized = false;
    rectState = NOT_SET;
    lblsState = NOT_SET;
    prLblsState = NOT_SET;
    iterCount = 0;
}

void GCApplication::setImageAndWinName( const Mat& _image, const string& _winName  )
{
    if( _image.empty() || _winName.empty() )
        return;
    image = &_image;
    winName = &_winName;
    mask.create( image->size(), CV_8UC4);
    reset();
}

void GCApplication::clearRect()
{
    rectState = NOT_SET;
}

void GCApplication::showImage() const
{
    if(image->empty() || winName->empty())
        return;
    
    Mat res;
    Mat img_masked;
    Mat binMask;
    if(!isInitialized)
    {
        image->copyTo(res);
        image->copyTo(img_masked);
    }
    else
    {
        getBinMask(mask, binMask);
        image->copyTo(res, binMask); //copy to res only non-zero on binmask
        image->copyTo(img_masked, binMask);
    }
    
    //write circles for bgd_fgd and prbgd_fgd
    vector<Point>::const_iterator it;
    for(it = bgdPxls.begin(); it != bgdPxls.end(); ++it)
        circle(res, *it, radius, BLUE, thickness);
    for(it = fgdPxls.begin(); it != fgdPxls.end(); ++it)
        circle(res, *it, radius, RED, thickness);
    for(it = prBgdPxls.begin(); it != prBgdPxls.end(); ++it)
        circle(res, *it, radius, LIGHTBLUE, thickness);
    for(it = prFgdPxls.begin(); it != prFgdPxls.end(); ++it)
        circle(res, *it, radius, PINK, thickness);
    
    if(rectState == IN_PROCESS || rectState == SET)
        rectangle(res, Point(rect.x, rect.y), Point(rect.x + rect.width, rect.y + rect.height), GREEN, 2);
    
    string fname = "grabcut_img.png";
    string fname_alpha = "grabcut_img_alpha.png";
    
    
    uchar* newdata = new uchar[img_masked.total()*4];
    Mat matRGBA(img_masked.size(), CV_8UC4, newdata);
    cvtColor(img_masked, matRGBA, CV_RGB2RGBA, 4);
    
    //set alpha values of matRGBA based on binMask
    if(isInitialized)
    {
        for(int i = 0; i < matRGBA.rows; i++)
        {
            for(int j = 0; j < matRGBA.cols; j++)
            {
                Vec4b& v = matRGBA.at<Vec4b>(i,j);
                if(binMask.at<uchar>(i,j) == 0)
                    v[3] = 0;
                else
                    v[3] = 255;
            }
        }
    }
    //crops Region Of Interest based on choosen rect
    if(CROP)
    {
      /*
      if(rectState == SET)
          matRGBA = matRGBA(rect);
       */
      matRGBA = matRGBA(rect);
    }
    
    imwrite(fname, res);
    imwrite(fname_alpha, matRGBA);
    imshow(*winName, res);
}

void GCApplication::setRectInMask()
{
    assert( !mask.empty() );
    mask.setTo(Scalar(255,255,255,255)); //GC_BGD );
    rect.x = max(0, rect.x);
    rect.y = max(0, rect.y);
    rect.width = min(rect.width, image->cols-rect.x);
    rect.height = min(rect.height, image->rows-rect.y);
    (mask(rect)).setTo( Scalar(255,255,255,255));//GC_PR_FGD) );
}

void GCApplication::setLblsInMask( int flags, Point p, bool isPr )
{
    vector<Point> *bpxls, *fpxls;
    uchar bvalue, fvalue;
    if( !isPr )
    {
      bpxls = &bgdPxls;
      fpxls = &fgdPxls;
      bvalue = GC_BGD;
      fvalue = GC_FGD;
    }
    else
    {
      bpxls = &prBgdPxls;
      fpxls = &prFgdPxls;
      bvalue = GC_PR_BGD;
      fvalue = GC_PR_FGD;
    }
    if( flags & BGD_KEY )
    {
      bpxls->push_back(p);
      circle( mask, p, radius, bvalue, thickness );
    }
    if( flags & FGD_KEY )
    {
      fpxls->push_back(p);
      circle( mask, p, radius, fvalue, thickness );
    }
}

void GCApplication::autoRect(int x, int y, int width, int height, string filepath, string useruid)
{
  if(DEBUG) 
  {
    cout << filepath << endl;
    cout << x << " - " << y << endl;
    cout << width << " - " << height << endl;
    cout << "userid " << useruid << endl;
  }
  
  rect = Rect(Point(x, y), Point(width+x,height+y));
  rectState = SET;
  setRectInMask();
  
  nextIter();
  
  Mat res;
  Mat binMask;
  Mat img_masked;
  
  if( !isInitialized )
  {
      res.setTo(Scalar::all(255));
      image->copyTo(res);
      image->copyTo(img_masked);
  }
  else
  {
      res.setTo(Scalar::all(255));        
      getBinMask(mask, binMask);
      image->copyTo(res, binMask);
      image->copyTo(img_masked, binMask);
  }
  clearRect();
  //showImage();
  
  nextIter();
  
//HERE
  //extract filename only
  int lastindex = (int)filepath.find_last_of("/");
  string savefolder = savepath+useruid+"/";
  string rawname = filepath.substr(lastindex + 1, filepath.length());
  string fname = rawname+suffix+fileext;
  string fname_alpha = rawname+alphasuffix+fileext;
  
  if(DEBUG) {
    cout << rawname << endl;
    cout << fname << endl;
    cout << fname_alpha << endl;
    cout << savefolder << endl;
  }
  

  uchar* newdata = new uchar[img_masked.total()*4];
  Mat matRGBA(img_masked.size(), CV_8UC4, newdata);
  cvtColor(img_masked, matRGBA, CV_RGB2RGBA, 4);
  
  //set alpha values of matRGBA based on binMask
  if(isInitialized)
  {
    for(int i = 0; i < matRGBA.rows; i++)
    {
      for(int j = 0; j < matRGBA.cols; j++)
      {
        Vec4b& v = matRGBA.at<Vec4b>(i,j);
        if(binMask.at<uchar>(i,j) == 0)
          v[3] = 0;
        else
          v[3] = 255;
      }
    }
  }

  //crops region of interest based on choosen rect  
  if(CROP)
  {  
    matRGBA = matRGBA(rect);    
  }
  
  //create folder if doesn't exit
  string pathuid = savepath+useruid+"/";
  mkdir(pathuid.c_str(), 0775);
  //imwrite(savefolder+fname, res);
  imwrite(savefolder+fname_alpha, matRGBA);   
}

void GCApplication::mouseClick( int event, int x, int y, int flags, void* )
{
    // TODO add bad args check
    switch( event )
    {
        case CV_EVENT_LBUTTONDOWN: // set rect or GC_BGD(GC_FGD) labels
        {
            bool isb = (flags & BGD_KEY) != 0,
            isf = (flags & FGD_KEY) != 0;
            if( rectState == NOT_SET && !isb && !isf )
            {
                rectState = IN_PROCESS;
                rect = Rect( x, y, 1, 1 );
            }
            if ( (isb || isf) && rectState == SET )
                lblsState = IN_PROCESS;
        }
            break;
        case CV_EVENT_RBUTTONDOWN: // set GC_PR_BGD(GC_PR_FGD) labels
        {
            bool isb = (flags & BGD_KEY) != 0,
            isf = (flags & FGD_KEY) != 0;
            if ( (isb || isf) && rectState == SET )
                prLblsState = IN_PROCESS;
        }
            break;
        case CV_EVENT_LBUTTONUP:
            if( rectState == IN_PROCESS )
            {
                rect = Rect( Point(rect.x, rect.y), Point(x,y) );
                rectState = SET;
                setRectInMask();
                assert( bgdPxls.empty() && fgdPxls.empty() && prBgdPxls.empty() && prFgdPxls.empty() );
                showImage();
            }
            if( lblsState == IN_PROCESS )
            {
                setLblsInMask(flags, Point(x,y), false);
                lblsState = SET;
                showImage();
            }
            break;
        case CV_EVENT_RBUTTONUP:
            if( prLblsState == IN_PROCESS )
            {
                setLblsInMask(flags, Point(x,y), true);
                prLblsState = SET;
                showImage();
            }
            break;
        case CV_EVENT_MOUSEMOVE:
            if( rectState == IN_PROCESS )
            {
                rect = Rect( Point(rect.x, rect.y), Point(x,y) );
                assert( bgdPxls.empty() && fgdPxls.empty() && prBgdPxls.empty() && prFgdPxls.empty() );
                showImage();
            }
            else if( lblsState == IN_PROCESS )
            {
                setLblsInMask(flags, Point(x,y), false);
                showImage();
            }
            else if( prLblsState == IN_PROCESS )
            {
                setLblsInMask(flags, Point(x,y), true);
                showImage();
            }
            break;
    }
}

int GCApplication::nextIter()
{
    if( isInitialized )
        grabCut( *image, mask, rect, bgdModel, fgdModel, 1 );
    else
    {
        if( rectState != SET )
            return iterCount;
        
        if( lblsState == SET || prLblsState == SET )
            grabCut( *image, mask, rect, bgdModel, fgdModel, 1, GC_INIT_WITH_MASK );
        else
            grabCut( *image, mask, rect, bgdModel, fgdModel, 1, GC_INIT_WITH_RECT );
        
        isInitialized = true;
    }
    iterCount++;
    
    bgdPxls.clear(); fgdPxls.clear();
    prBgdPxls.clear(); prFgdPxls.clear();
    
    return iterCount;
}

GCApplication gcapp;

static void on_mouse( int event, int x, int y, int flags, void* param )
{
    gcapp.mouseClick( event, x, y, flags, param );
}

static int validateFilename(string filename) {  
  return filename.empty() ? 0 : 1;
}

static int validateImage(Mat image) {
  return image.empty() ? 0 : 1;
}

void GCApplication::doRectangle(char** argv) 
{
  Mat image;
  
  string filepath, useruid, savepath;
  int x, y, width, height;
  
  //create struct
  filepath = argv[1];
  x = atoi(argv[2]);
  y = atoi(argv[3]);
  width = atoi(argv[4]);
  height = atoi(argv[5]); 
  useruid = argv[6];

  if(DEBUG) 
  {
    cout << filepath << endl;
    cout << x << " - " << y << endl;
    cout << width << " - " << height << endl;
    cout << "userid " << useruid << endl;
  }
  
  if (validateFilename(filepath)) {
    image = imread(filepath, 1);   
    cout << "valid filepath" << endl;
  } else {
    ;// treat error
  }

  if (validateImage(image)) {                
    cout << "valid image" << endl;
    const string winName = "image";
    gcapp.setImageAndWinName(image, winName);
    //remove .extension
    int lastindex = (int)filepath.find_last_of("."); 
    string pathextless = filepath.substr(0, lastindex); 
    gcapp.autoRect(x,y,width, height, pathextless, useruid);
  }
}


int main(int argc, char** argv )
{
  cout << "Testing:" << endl;
  cout << argc << endl;
  
  //get executable path
/*
  char path[1024];
  uint32_t size = sizeof(path);
  string exepath;

  if (_NSGetExecutablePath(path, &size) == 0) {
    string strpath(path);
    int lastindex = (int)strpath.find_last_of(".");
    exepath = strpath.substr(0,lastindex - 1);
    if(DEBUG) 
    {
      cout << path << endl;
      cout << exepath << endl;
    }
  }
  else
    printf("buffer too small; need size %u\n", size);
*/
  //change for flags
  switch(argc) {
    case 4:
      //do frnd bknd 
    case 7:
      gcapp.doRectangle(argv); 
    default:
      break;
  }
/*
  while(true) 
  {    
    int flag;
    string argvk;

    getline(cin, argvk);  
    istringstream iss(argvk);
    iss >> flag;
    
    switch(flag) 
    {      
      case EXIT:
        cout << "Exiting" << endl;
        goto exit_main;
        
      case RECT:
        cout << "Applying rectangle:" << endl;
        gcapp.doRectangle(iss);        
        break;
        
      case BKGDFRGD:
        cout << "Applying bkgd frgd:" << endl;      
        break;
        
      default:
        break;
    }  
  }
 */
  
exit_main:
  return 0;
}
