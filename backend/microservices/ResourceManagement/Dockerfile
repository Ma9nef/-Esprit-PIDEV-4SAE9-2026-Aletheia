FROM eclipse-temurin:17-jre-alpine
EXPOSE 8094
ADD target/ResourceManagement-0.0.1-SNAPSHOT.jar ResourceManagement.jar
ENTRYPOINT ["java", "-jar", "ResourceManagement.jar"]
