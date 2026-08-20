@echo off

IF [%1] EQU [] (
    echo USAGE: %0 server.properties
    EXIT /B 1
)

SetLocal

rem Using pushd popd to set BASE_DIR to the absolute path
pushd %~dp0..\..
set BASE_DIR=%CD%
popd

rem Log4j settings
IF ["%KAFKA_LOG4J_OPTS%"] EQU [""] (
    set KAFKA_LOG4J_OPTS=-Dlog4j2.configurationFile=%BASE_DIR%/config/tools-log4j2.yaml
)

rem Start Kafka
"%~dp0kafka-run-class.bat" kafka.Kafka %*

EndLocal