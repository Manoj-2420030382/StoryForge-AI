from app.schemas.refinement_schema import QualityResult, QualityBreakdown, RefinedStoryResult
import re

class QualityScorer:
    def score_story(self, refined_story: RefinedStoryResult) -> QualityResult:
        # Clarity Score: checks for 'As a ... I want ... so that' format
        clarity_score = 100 if re.search(r'As a .* I want .* so that .*', refined_story.description, re.IGNORECASE) else 50
        
        # Specificity Score: checks description length (too short is bad)
        desc_words = len(refined_story.description.split())
        specificity_score = min(100, max(20, (desc_words / 50) * 100))
        
        # Testability: checks for Given/When/Then in acceptance criteria
        ac_count = len(refined_story.acceptanceCriteria)
        testable_acs = sum(1 for ac in refined_story.acceptanceCriteria if 'given' in ac.lower() and 'when' in ac.lower() and 'then' in ac.lower())
        testability_score = 100 if ac_count > 0 and testable_acs == ac_count else (testable_acs / ac_count * 100 if ac_count > 0 else 0)
        
        # Completeness: has title, desc, and at least 2 ACs
        completeness_score = 100 if refined_story.title and refined_story.description and ac_count >= 2 else 60
        
        # INVEST: heuristic based on previous scores
        invest_score = (clarity_score + testability_score + completeness_score) / 3
        
        total_score = int((clarity_score + specificity_score + testability_score + completeness_score + invest_score) / 5)
        
        level = "POOR"
        if total_score >= 90:
            level = "EXCELLENT"
        elif total_score >= 75:
            level = "GOOD"
        elif total_score >= 50:
            level = "NEEDS_IMPROVEMENT"
            
        return QualityResult(
            score=total_score,
            level=level,
            breakdown=QualityBreakdown(
                clarity=int(clarity_score),
                specificity=int(specificity_score),
                testability=int(testability_score),
                completeness=int(completeness_score),
                invest=int(invest_score)
            )
        )
