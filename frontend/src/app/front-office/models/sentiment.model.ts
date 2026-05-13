export interface CommentSentiment {
  id: number;
  comment: string;
  eventId: number;
  userId: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  confidence: number;
  positiveScore: number;
  neutralScore: number;
  negativeScore: number;
  createdAt: string;
}

export interface EventSentimentStats {
  eventId: number;
  totalComments: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
  overallSentimentScore: number;
  sentimentLabel: string;
}

export interface CommentWithSentiment {
  id: number;
  comment: string;
  eventId: number;
  userId: number;
  sentiment: string;
  confidence: number;
  positiveScore: number;
  neutralScore: number;
  negativeScore: number;
  createdAt: string;
}