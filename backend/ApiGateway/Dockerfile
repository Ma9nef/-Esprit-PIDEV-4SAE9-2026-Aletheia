FROM eclipse-temurin:17-jre-alpine
EXPOSE 8089
ADD target/ApiGateway-0.0.1-SNAPSHOT.jar ApiGateway.jar
ENTRYPOINT ["java", "-jar", "ApiGateway.jar"]
