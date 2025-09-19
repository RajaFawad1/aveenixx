import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, User, Calendar, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Question {
  id: string;
  question: string;
  author: string;
  date: string;
  answers: {
    id: string;
    answer: string;
    author: string;
    date: string;
    isVerified: boolean;
    helpful: number;
  }[];
}

interface QuestionsAnswersProps {
  productId: string;
  questions?: Question[];
}

export function QuestionsAnswers({ productId, questions = [] }: QuestionsAnswersProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  // Sample questions if none provided
  const sampleQuestions: Question[] = [
    {
      id: "q1",
      question: "What's the sizing like? Should I order my usual size?",
      author: "ShopperMike",
      date: "2 days ago",
      answers: [
        {
          id: "a1",
          answer: "I'd recommend ordering one size up. The fit runs slightly small, especially around the chest area.",
          author: "Verified Buyer",
          date: "1 day ago",
          isVerified: true,
          helpful: 8
        }
      ]
    },
    {
      id: "q2", 
      question: "Is this machine washable?",
      author: "LaundryQueen",
      date: "5 days ago",
      answers: [
        {
          id: "a2",
          answer: "Yes, it's machine washable on cold. I've washed mine several times with no issues.",
          author: "Happy Customer",
          date: "4 days ago",
          isVerified: true,
          helpful: 12
        }
      ]
    }
  ];

  const displayQuestions = questions.length > 0 ? questions : sampleQuestions;

  if (displayQuestions.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No questions yet. Be the first to ask!
        </p>
        <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white">
          Ask a Question
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Questions & Answers ({displayQuestions.length})
        </h3>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
          Ask a Question
        </Button>
      </div>

      <div className="space-y-4">
        {displayQuestions.map((question) => (
          <Card key={question.id} className="border border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              {/* Question */}
              <div 
                className="cursor-pointer"
                onClick={() => toggleQuestion(question.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">
                      Q: {question.question}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <User className="w-4 h-4 mr-1" />
                      <span className="mr-3">{question.author}</span>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{question.date}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {expandedQuestions.has(question.id) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Answers */}
              {expandedQuestions.has(question.id) && question.answers.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-yellow-200 dark:border-yellow-800">
                  {question.answers.map((answer) => (
                    <div key={answer.id} className="mb-4 last:mb-0">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-gray-700 dark:text-gray-300">
                          A: {answer.answer}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <User className="w-4 h-4 mr-1" />
                          <span className="mr-2">{answer.author}</span>
                          {answer.isVerified && (
                            <Badge variant="secondary" className="mr-2 text-xs">
                              Verified
                            </Badge>
                          )}
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{answer.date}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-xs">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Helpful ({answer.helpful})
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}