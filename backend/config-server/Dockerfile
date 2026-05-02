FROM eclipse-temurin:17-jre-alpine
EXPOSE 9999
ADD target/config-server-0.0.1-SNAPSHOT.jar config-server.jar
ENTRYPOINT ["java", "-jar", "config-server.jar"]
