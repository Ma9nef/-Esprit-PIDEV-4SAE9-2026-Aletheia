FROM eclipse-temurin:17-jre-alpine
EXPOSE 8081
ADD target/courses-0.0.1-SNAPSHOT.jar courses.jar
ENTRYPOINT ["java", "-jar", "courses.jar"]
