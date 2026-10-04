cmake_minimum_required(VERSION 3.22.1)
project(NitroAirwallex)

set (PACKAGE_NAME NitroAirwallex)
set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 20)

add_library(${PACKAGE_NAME} SHARED
        src/main/cpp/cpp-adapter.cpp
)

include(${CMAKE_SOURCE_DIR}/../nitrogen/generated/android/NitroAirwallex+autolinking.cmake)

include_directories(
        "src/main/cpp"
)

find_library(LOG_LIB log)

target_link_libraries(
        ${PACKAGE_NAME}
        ${LOG_LIB}
        android
)
