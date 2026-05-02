FROM eclipse-temurin:17-jre-alpine
EXPOSE 8080
ADD target/user-service-0.0.1-SNAPSHOT.jar user-service.jar
ENTRYPOINT ["java", "-jar", "user-service.jar"]
