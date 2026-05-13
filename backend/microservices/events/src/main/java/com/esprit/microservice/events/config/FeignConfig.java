package tn.esprit.microservice.events.config;

import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    // ❌ SUPPRIMEZ ou COMMENTEZ ce bean
    // @Bean
    // Logger.Level feignLoggerLevel() {
    //     return Logger.Level.FULL;
    // }

    @Bean
    public ErrorDecoder errorDecoder() {
        return (methodKey, response) -> {
            System.err.println("Erreur Feign: " + methodKey);
            System.err.println("Status: " + response.status());
            return new Exception("Erreur lors de l'appel externe");
        };
    }
}