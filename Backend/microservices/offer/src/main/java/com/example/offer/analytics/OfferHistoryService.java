package com.example.offer.analytics;

import com.example.offer.repository.OfferRepository;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfferHistoryService {

    private final OfferHistoryRepository repository;
    private final OfferRepository offerRepository;
    private final MongoTemplate mongoTemplate;

    // ============================================
    // QUESTION 1 : QUEL TYPE D'OFFRE CONVERTIT LE PLUS ?
    // ============================================

    public Map<String, Object> getConversionByOfferType() {
        Map<String, Object> result = new LinkedHashMap<>();

        // Agrégation pour les ventes par type
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group("offerType")
                        .count().as("totalConversions")
                        .sum("finalPrice").as("totalRevenue")
                        .sum("discountAmount").as("totalDiscount")
                        .avg("finalPrice").as("averageBasket"),
                Aggregation.sort(Sort.Direction.DESC, "totalConversions")
        );

        List<Document> salesByType = mongoTemplate.aggregate(
                aggregation,
                "offer_history",
                Document.class
        ).getMappedResults();

        // Ajouter des métriques de conversion
        List<Map<String, Object>> enhancedTypes = new ArrayList<>();

        for (Document doc : salesByType) {
            Map<String, Object> typeInfo = new HashMap<>();
            String offerType = doc.getString("_id");

            typeInfo.put("offerType", offerType);
            typeInfo.put("totalConversions", doc.getInteger("totalConversions"));
            typeInfo.put("totalRevenue", doc.getDouble("totalRevenue"));
            typeInfo.put("totalDiscount", doc.getDouble("totalDiscount"));
            typeInfo.put("averageBasket", doc.getDouble("averageBasket"));

            // Compter les utilisateurs distincts pour ce type d'offre
            long uniqueUsers = countDistinctUsersByOfferType(offerType);
            typeInfo.put("uniqueCustomers", (int) uniqueUsers);

            // TAUX DE CONVERSION
            long totalOffersOfType = offerRepository.countByType(offerType);
            double conversionRate = totalOffersOfType > 0
                    ? (doc.getInteger("totalConversions") * 100.0) / totalOffersOfType
                    : 0;
            typeInfo.put("conversionRate", Math.round(conversionRate * 100.0) / 100.0 + "%");

            // REVENU PAR CONVERSION
            double revenuePerConversion = doc.getDouble("totalRevenue") / doc.getInteger("totalConversions");
            typeInfo.put("revenuePerConversion", Math.round(revenuePerConversion * 100.0) / 100.0);

            enhancedTypes.add(typeInfo);
        }

        // Identifier le meilleur type
        String bestType = enhancedTypes.isEmpty() ? "Aucune" :
                enhancedTypes.stream()
                        .max(Comparator.comparing(t -> (Integer) t.get("totalConversions")))
                        .map(t -> (String) t.get("offerType"))
                        .orElse("Inconnu");

        result.put("question", "Quel type d'offre convertit le plus ?");
        result.put("answer", bestType);
        result.put("details", enhancedTypes);

        return result;
    }

    // Méthode utilitaire pour compter les utilisateurs distincts par type d'offre
    private long countDistinctUsersByOfferType(String offerType) {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("offerType").is(offerType)),
                Aggregation.group("userId").first("userId").as("userId"),
                Aggregation.group().count().as("total")
        );

        List<Document> result = mongoTemplate.aggregate(
                agg,
                "offer_history",
                Document.class
        ).getMappedResults();

        return result.isEmpty() ? 0 : ((Document) result.get(0)).getInteger("total");
    }

    // ============================================
    // QUESTION 2 : QUELLE PÉRIODE GÉNÈRE LE PLUS DE VENTES ?
    // ============================================

    public Map<String, Object> getBestSalesPeriod() {
        Map<String, Object> result = new LinkedHashMap<>();

        // 1️⃣ ANALYSE PAR MOIS
        Aggregation monthAgg = Aggregation.newAggregation(
                Aggregation.project()
                        .andExpression("year(purchaseDate)").as("year")
                        .andExpression("month(purchaseDate)").as("month")
                        .andInclude("finalPrice", "userId"),
                Aggregation.group("year", "month")
                        .count().as("totalSales")
                        .sum("finalPrice").as("revenue"),
                Aggregation.sort(Sort.Direction.DESC, "revenue")
        );

        List<Document> monthlySales = mongoTemplate.aggregate(
                monthAgg,
                "offer_history",
                Document.class
        ).getMappedResults();

        // Enrichir avec le nombre d'utilisateurs distincts par mois
        List<Document> enrichedMonthlySales = new ArrayList<>();
        for (Document monthDoc : monthlySales) {
            Document id = (Document) monthDoc.get("_id");
            int year = id.getInteger("year");
            int month = id.getInteger("month");

            long uniqueUsers = countDistinctUsersByYearMonth(year, month);
            monthDoc.append("uniqueCustomers", (int) uniqueUsers);
            enrichedMonthlySales.add(monthDoc);
        }

        // 2️⃣ ANALYSE PAR JOUR DE LA SEMAINE
        Aggregation dayAgg = Aggregation.newAggregation(
                Aggregation.project()
                        .andExpression("dayOfWeek(purchaseDate)").as("dayOfWeek")
                        .andInclude("finalPrice"),
                Aggregation.group("dayOfWeek")
                        .count().as("totalSales")
                        .sum("finalPrice").as("revenue"),
                Aggregation.sort(Sort.Direction.DESC, "revenue")
        );

        List<Document> dailySales = mongoTemplate.aggregate(
                dayAgg,
                "offer_history",
                Document.class
        ).getMappedResults();

        // 3️⃣ ANALYSE PAR HEURE
        Aggregation hourAgg = Aggregation.newAggregation(
                Aggregation.project()
                        .andExpression("hour(purchaseDate)").as("hour")
                        .andInclude("finalPrice"),
                Aggregation.group("hour")
                        .count().as("totalSales")
                        .sum("finalPrice").as("revenue"),
                Aggregation.sort(Sort.Direction.DESC, "revenue")
        );

        List<Document> hourlySales = mongoTemplate.aggregate(
                hourAgg,
                "offer_history",
                Document.class
        ).getMappedResults();

        // Traitement des résultats
        Map<String, Object> periods = new HashMap<>();

        // Meilleur mois
        if (!enrichedMonthlySales.isEmpty()) {
            Document bestMonth = enrichedMonthlySales.get(0);
            Document monthId = (Document) bestMonth.get("_id");
            int year = monthId.getInteger("year");
            int month = monthId.getInteger("month");

            periods.put("bestMonth", String.format("%d-%02d", year, month));
            periods.put("bestMonthSales", bestMonth.getInteger("totalSales"));
            periods.put("bestMonthRevenue", bestMonth.getDouble("revenue"));
            periods.put("bestMonthCustomers", bestMonth.getInteger("uniqueCustomers"));
        }

        // Meilleur jour
        if (!dailySales.isEmpty()) {
            Document bestDay = dailySales.get(0);
            int dayOfWeek = bestDay.getInteger("_id");
            String[] days = {"", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"};

            periods.put("bestDayOfWeek", days[dayOfWeek]);
            periods.put("bestDaySales", bestDay.getInteger("totalSales"));
        }

        // Meilleure heure
        if (!hourlySales.isEmpty()) {
            Document bestHour = hourlySales.get(0);
            int hour = bestHour.getInteger("_id");

            periods.put("bestHour", String.format("%02dh-%02dh", hour, hour+1));
            periods.put("bestHourSales", bestHour.getInteger("totalSales"));
        }

        result.put("question", "Quelle période génère le plus de ventes ?");
        result.put("answer", periods.get("bestMonth") + " (meilleur mois)");
        result.put("details", periods);
        result.put("monthlyBreakdown", enrichedMonthlySales);

        return result;
    }

    // Méthode utilitaire pour compter les utilisateurs distincts par mois
    private long countDistinctUsersByYearMonth(int year, int month) {
        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end = start.plusMonths(1).minusSeconds(1);

        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("purchaseDate").gte(start).lte(end)),
                Aggregation.group("userId").first("userId").as("userId"),
                Aggregation.group().count().as("total")
        );

        List<Document> result = mongoTemplate.aggregate(
                agg,
                "offer_history",
                Document.class
        ).getMappedResults();

        return result.isEmpty() ? 0 : ((Document) result.get(0)).getInteger("total");
    }

    // ============================================
    // QUESTION 3 : QUEL INSTRUCTEUR PERFORME LE MIEUX EN PROMOTION ?
    // ============================================

    public Map<String, Object> getTopInstructorsWithDetails() {
        Map<String, Object> result = new LinkedHashMap<>();

        // Agrégation pour les instructeurs
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group("instructorId")
                        .count().as("totalSales")
                        .sum("finalPrice").as("revenue")
                        .sum("discountAmount").as("totalDiscountGiven")
                        .avg("discountAmount").as("avgDiscount")
                        .addToSet("courseId").as("uniqueCourses")
                        .addToSet("offerType").as("uniqueOfferTypes"),
                Aggregation.sort(Sort.Direction.DESC, "revenue")
        );

        List<Document> instructors = mongoTemplate.aggregate(
                aggregation,
                "offer_history",
                Document.class
        ).getMappedResults();

        // Enrichir avec les noms des instructeurs et métriques supplémentaires
        List<Map<String, Object>> enhancedInstructors = new ArrayList<>();

        for (int i = 0; i < instructors.size(); i++) {
            Document doc = instructors.get(i);
            Map<String, Object> instructorInfo = new HashMap<>();

            String instructorId = doc.getString("_id");
            List<String> uniqueCourses = (List<String>) doc.get("uniqueCourses");
            List<String> uniqueOfferTypes = (List<String>) doc.get("uniqueOfferTypes");

            instructorInfo.put("rank", i + 1);
            instructorInfo.put("instructorId", instructorId);
            instructorInfo.put("totalSales", doc.getInteger("totalSales"));
            instructorInfo.put("revenue", Math.round(doc.getDouble("revenue") * 100.0) / 100.0);
            instructorInfo.put("totalDiscountGiven", Math.round(doc.getDouble("totalDiscountGiven") * 100.0) / 100.0);
            instructorInfo.put("avgDiscount", Math.round(doc.getDouble("avgDiscount") * 100.0) / 100.0);
            instructorInfo.put("coursesSold", uniqueCourses != null ? uniqueCourses.size() : 0);
            instructorInfo.put("offerTypesUsed", uniqueOfferTypes != null ? uniqueOfferTypes.size() : 0);

            // Compter les étudiants distincts pour cet instructeur
            long uniqueStudents = countDistinctStudentsByInstructor(instructorId);
            instructorInfo.put("uniqueStudents", (int) uniqueStudents);

            // REVENU PAR ÉTUDIANT
            double revenuePerStudent = uniqueStudents > 0
                    ? doc.getDouble("revenue") / uniqueStudents
                    : 0;
            instructorInfo.put("revenuePerStudent", Math.round(revenuePerStudent * 100.0) / 100.0);

            // VENTES PAR COURS
            double salesPerCourse = instructorInfo.get("coursesSold") != null && (int) instructorInfo.get("coursesSold") > 0
                    ? (double) doc.getInteger("totalSales") / (int) instructorInfo.get("coursesSold")
                    : 0;
            instructorInfo.put("salesPerCourse", Math.round(salesPerCourse * 100.0) / 100.0);

            // EFFICACITÉ DE LA PROMOTION
            double totalOriginalValue = doc.getDouble("revenue") + doc.getDouble("totalDiscountGiven");
            double promoEffectiveness = totalOriginalValue > 0
                    ? (doc.getDouble("revenue") * 100.0) / totalOriginalValue
                    : 0;
            instructorInfo.put("promoEffectiveness", Math.round(promoEffectiveness * 100.0) / 100.0 + "%");

            enhancedInstructors.add(instructorInfo);
        }

        // Identifier le meilleur instructeur
        String topInstructor = enhancedInstructors.isEmpty() ? "Aucun" :
                enhancedInstructors.get(0).get("instructorId").toString();

        result.put("question", "Quel instructeur performe le mieux en promotion ?");
        result.put("answer", "Instructeur #" + topInstructor);
        result.put("topInstructor", enhancedInstructors.isEmpty() ? null : enhancedInstructors.get(0));
        result.put("allInstructors", enhancedInstructors);

        return result;
    }

    // Méthode utilitaire pour compter les étudiants distincts par instructeur
    private long countDistinctStudentsByInstructor(String instructorId) {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("instructorId").is(instructorId)),
                Aggregation.group("userId").first("userId").as("userId"),
                Aggregation.group().count().as("total")
        );

        List<Document> result = mongoTemplate.aggregate(
                agg,
                "offer_history",
                Document.class
        ).getMappedResults();

        return result.isEmpty() ? 0 : ((Document) result.get(0)).getInteger("total");
    }

    // ============================================
    // MÉTHODE PRINCIPALE : TOUTES LES ANALYSES EN UNE FOIS
    // ============================================

    public Map<String, Object> getCompleteAnalytics() {
        Map<String, Object> dashboard = new LinkedHashMap<>();

        dashboard.put("timestamp", new Date());
        dashboard.put("conversionByType", getConversionByOfferType());
        dashboard.put("bestPeriod", getBestSalesPeriod());
        dashboard.put("topInstructors", getTopInstructorsWithDetails());

        // Ajouter un résumé exécutif
        Map<String, String> executiveSummary = new LinkedHashMap<>();

        Map<String, Object> conversionData = (Map<String, Object>) dashboard.get("conversionByType");
        executiveSummary.put("meilleur_type_offre", conversionData.get("answer").toString());

        Map<String, Object> periodData = (Map<String, Object>) dashboard.get("bestPeriod");
        executiveSummary.put("meilleure_periode", periodData.get("answer").toString());

        Map<String, Object> instructorData = (Map<String, Object>) dashboard.get("topInstructors");
        executiveSummary.put("meilleur_instructeur", instructorData.get("answer").toString());

        dashboard.put("executiveSummary", executiveSummary);

        return dashboard;
    }

    // ============================================
    // MÉTHODES ORIGINALES CONSERVÉES
    // ============================================

    public List<Document> getSalesByType() {
        return (List<Document>) getConversionByOfferType().get("details");
    }

    public List<Document> getSalesByMonth() {
        Map<String, Object> periodData = getBestSalesPeriod();
        return (List<Document>) periodData.get("monthlyBreakdown");
    }

    public List<Document> getTopInstructors() {
        Map<String, Object> instructorData = getTopInstructorsWithDetails();
        return (List<Document>) instructorData.get("allInstructors");
    }
}