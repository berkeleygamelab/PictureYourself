# Compiles OpenCV C++ programs.
CPP=g++
CFLAGS = $(shell pkg-config --cflags opencv)
LIBS = $(shell pkg-config --libs opencv)
# Include this for debugging symbols.
FLAGS = -g

ALLCSRCS := $(wildcard *.c)
ALLCPPSRCS := $(wildcard *.cc)
ALLEXEC := $(ALLCSRCS:.c=) $(ALLCPPSRCS:.cc=)
all: $(ALLEXEC)
%: %.cc
	$(CPP) $(CFLAGS) -o $@ $< $(LIBS)

clean:
	rm -f *.o $(ALLEXEC)
.PHONY: all clean
