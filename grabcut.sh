# Compile grabcut. This is necessary because different versions of OSX have libraries that grabcut uses in different places,
# making a single grabcut executable difficult.
cd OpenCVSource
make
if [ -e grabcut ]; then
    echo "Compiled grabcut successfully.";
    # Renames current existing grabcut executable to backup
    mv ../grabcut ../grabcut.backup;
    # Move new executable to PIC root
    mv grabcut ../grabcut;
else
    echo "Compiling grabcut failed. Exiting.";
    exit 1;
fi
echo "\n"
cd ..
