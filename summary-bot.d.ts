declare module 'summary-bot' {
    interface AnalyzeResult {
        text: string;
        percentReduction: number;
        bestSentences: string[];
        originalLength: number;
        summaryLength: number;
        sentenceCount: number;
    }
    export default function analyze(content: string, summarySentenceCount: number): AnalyzeResult
}