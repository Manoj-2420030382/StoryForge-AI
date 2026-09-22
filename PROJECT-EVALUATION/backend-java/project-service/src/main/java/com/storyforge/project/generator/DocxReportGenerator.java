package com.storyforge.project.generator;

import com.storyforge.project.dto.StoryDto;
import com.storyforge.project.entity.Project;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class DocxReportGenerator {

    public byte[] generateProjectReport(Project project, List<StoryDto> stories) throws IOException {
        try (XWPFDocument document = new XWPFDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Cover Page
            createCoverPage(document, project);
            document.createParagraph().setPageBreak(true);

            // Project Overview
            createSectionHeader(document, "1. PROJECT OVERVIEW");
            createOverviewSection(document, project);

            // Statistics
            createSectionHeader(document, "2. PROJECT STATISTICS");
            createStatisticsSection(document, stories);
            document.createParagraph().setPageBreak(true);

            // Story Summary Table
            createSectionHeader(document, "3. STORY SUMMARY TABLE");
            createStorySummaryTable(document, stories);
            document.createParagraph().setPageBreak(true);

            // Complete Story Details
            createSectionHeader(document, "4. COMPLETE STORY DETAILS");
            for (int i = 0; i < stories.size(); i++) {
                createStoryDetailsSection(document, stories.get(i), i + 1);
            }

            document.write(out);
            return out.toByteArray();
        }
    }

    private void createCoverPage(XWPFDocument document, Project project) {
        XWPFParagraph titleParagraph = document.createParagraph();
        titleParagraph.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun titleRun = titleParagraph.createRun();
        titleRun.setText("STORYFORGE AI");
        titleRun.setBold(true);
        titleRun.setFontSize(24);
        titleRun.addBreak();
        titleRun.setText("Project User Story Refinement Report");
        titleRun.setFontSize(18);
        titleRun.addBreak();
        titleRun.addBreak();

        addMetaLine(document, "Project Name: ", project.getName());
        addMetaLine(document, "Project Description: ", project.getDescription());
        addMetaLine(document, "Project Status: ", project.getStatus());
        addMetaLine(document, "Created Date: ", formatDate(project.getCreatedAt()));
        addMetaLine(document, "Last Updated: ", formatDate(project.getUpdatedAt()));
        addMetaLine(document, "Generated On: ", formatDate(LocalDateTime.now()));
    }

    private void createSectionHeader(XWPFDocument document, String title) {
        XWPFParagraph paragraph = document.createParagraph();
        XWPFRun run = paragraph.createRun();
        run.setText("==================================================");
        run.addBreak();
        run.setText(title);
        run.addBreak();
        run.setText("==================================================");
        run.setBold(true);
        run.setFontSize(14);
    }

    private void createOverviewSection(XWPFDocument document, Project project) {
        addMetaLine(document, "Project Name: ", project.getName());
        addMetaLine(document, "Status: ", project.getStatus());
        addMetaLine(document, "Created Date: ", formatDate(project.getCreatedAt()));
        
        XWPFParagraph p = document.createParagraph();
        XWPFRun r = p.createRun();
        r.addBreak();
        r.setText("Project Summary:");
        r.setBold(true);
        r.addBreak();
        r.setText(project.getDescription() != null ? project.getDescription() : "No description provided.");
        r.addBreak();
    }

    private void createStatisticsSection(XWPFDocument document, List<StoryDto> stories) {
        int total = stories.size();
        int refined = 0;
        int notAnalyzed = 0;
        int refinementRequired = 0;
        int ready = 0;
        int failed = 0;
        double totalScore = 0;
        int scoredCount = 0;
        int totalPoints = 0;

        for (StoryDto s : stories) {
            String aiStatus = s.getAiRefinementStatus();
            if (aiStatus == null || aiStatus.equals("NOT_REFINED") || aiStatus.equals("NOT_ANALYZED")) {
                notAnalyzed++;
            } else if (aiStatus.equals("READY") || aiStatus.equals("REFINED")) {
                refined++;
                ready++;
            } else if (aiStatus.equals("REFINEMENT_REQUIRED")) {
                refinementRequired++;
            } else if (aiStatus.equals("FAILED")) {
                failed++;
            }

            if (s.getAiQualityScore() != null && s.getAiQualityScore() > 0) {
                totalScore += s.getAiQualityScore();
                scoredCount++;
            }

            if (s.getStoryPoints() != null) {
                totalPoints += s.getStoryPoints();
            }
        }

        addMetaLine(document, "Total Stories: ", String.valueOf(total));
        addMetaLine(document, "Refined Stories: ", String.valueOf(refined));
        addMetaLine(document, "Pending Analysis: ", String.valueOf(notAnalyzed));
        addMetaLine(document, "Refinement Required: ", String.valueOf(refinementRequired));
        addMetaLine(document, "Ready for Dev: ", String.valueOf(ready));
        addMetaLine(document, "Failed Analysis: ", String.valueOf(failed));
        
        String avgScore = scoredCount > 0 ? String.format("%.0f/100", totalScore / scoredCount) : "N/A";
        addMetaLine(document, "Average Quality Score: ", avgScore);
        addMetaLine(document, "Total Story Points: ", String.valueOf(totalPoints));
    }

    private void createStorySummaryTable(XWPFDocument document, List<StoryDto> stories) {
        if (stories.isEmpty()) {
            XWPFParagraph p = document.createParagraph();
            p.createRun().setText("No user stories have been added to this project.");
            return;
        }

        XWPFTable table = document.createTable(stories.size() + 1, 7);
        
        // Header Row
        XWPFTableRow header = table.getRow(0);
        setHeaderCell(header.getCell(0), "#");
        setHeaderCell(header.getCell(1), "Story Title");
        setHeaderCell(header.getCell(2), "Priority");
        setHeaderCell(header.getCell(3), "Status");
        setHeaderCell(header.getCell(4), "Points");
        setHeaderCell(header.getCell(5), "AI Status");
        setHeaderCell(header.getCell(6), "Score");

        // Data Rows
        for (int i = 0; i < stories.size(); i++) {
            StoryDto s = stories.get(i);
            XWPFTableRow row = table.getRow(i + 1);
            row.getCell(0).setText(String.valueOf(i + 1));
            row.getCell(1).setText(s.getTitle() != null ? s.getTitle() : "");
            row.getCell(2).setText(s.getPriority() != null ? s.getPriority() : "");
            row.getCell(3).setText(s.getStatus() != null ? s.getStatus() : "");
            row.getCell(4).setText(s.getStoryPoints() != null ? String.valueOf(s.getStoryPoints()) : "0");
            row.getCell(5).setText(s.getAiRefinementStatus() != null ? s.getAiRefinementStatus() : "NOT_ANALYZED");
            row.getCell(6).setText(s.getAiQualityScore() != null ? String.valueOf(s.getAiQualityScore()) : "-");
        }
    }

    private void setHeaderCell(XWPFTableCell cell, String text) {
        XWPFParagraph p = cell.getParagraphs().get(0);
        XWPFRun r = p.createRun();
        r.setBold(true);
        r.setText(text);
    }

    private void createStoryDetailsSection(XWPFDocument document, StoryDto story, int index) {
        XWPFParagraph p = document.createParagraph();
        XWPFRun r = p.createRun();
        r.setText("--------------------------------------------------");
        r.addBreak();
        r.setText("STORY " + index + ": " + story.getTitle());
        r.setBold(true);
        r.addBreak();
        r.setText("--------------------------------------------------");
        r.addBreak();

        addMetaLine(document, "Priority: ", story.getPriority());
        addMetaLine(document, "Status: ", story.getStatus());
        addMetaLine(document, "Story Points: ", String.valueOf(story.getStoryPoints()));
        addMetaLine(document, "AI Refinement Status: ", story.getAiRefinementStatus());
        addMetaLine(document, "AI Quality Score: ", story.getAiQualityScore() != null ? story.getAiQualityScore() + "/100" : "N/A");

        addTextBlock(document, "ORIGINAL USER STORY", story.getDescription());
        addTextBlock(document, "ACCEPTANCE CRITERIA", story.getAcceptanceCriteria());
        addTextBlock(document, "AI REFINEMENT SUMMARY", story.getAiRefinementSummary());

        document.createParagraph().createRun().addBreak();
    }

    private void addMetaLine(XWPFDocument document, String label, String value) {
        XWPFParagraph p = document.createParagraph();
        XWPFRun labelRun = p.createRun();
        labelRun.setBold(true);
        labelRun.setText(label);
        
        XWPFRun valueRun = p.createRun();
        valueRun.setText(value != null ? value : "N/A");
    }

    private void addTextBlock(XWPFDocument document, String header, String content) {
        XWPFParagraph p = document.createParagraph();
        XWPFRun r = p.createRun();
        r.addBreak();
        r.setText(header);
        r.setBold(true);
        r.addBreak();

        XWPFRun contentRun = p.createRun();
        if (content != null && !content.trim().isEmpty()) {
            String[] lines = content.split("\n");
            for (int i = 0; i < lines.length; i++) {
                contentRun.setText(lines[i]);
                if (i < lines.length - 1) {
                    contentRun.addBreak();
                }
            }
        } else {
            contentRun.setText("Information is not available.");
        }
    }

    private String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) return "N/A";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        return dateTime.format(formatter);
    }
}
