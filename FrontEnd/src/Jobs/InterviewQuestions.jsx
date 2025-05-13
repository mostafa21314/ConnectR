import React, { useState } from 'react';

const InterviewQuestions = ({ isOpen, onClose }) => {
  const [questions] = useState([
    // System Design Questions
    "How would you design a scalable real-time chat application?",
    "Explain how you would design a distributed caching system.",
    "How would you design a URL shortening service like bit.ly?",
    "Design a system for handling concurrent users in a multiplayer game.",
    "How would you design a recommendation system for an e-commerce platform?",
    "Explain the architecture of a content delivery network (CDN).",
    "How would you design a rate limiting system for an API?",
    "Design a system for handling file uploads and downloads at scale.",
    "How would you design a real-time analytics dashboard?",
    "Explain how you would design a distributed logging system.",

    // LeetCode Style Questions
    "Implement a function to find the longest palindromic substring in a string.",
    "Write a function to find the median of two sorted arrays.",
    "Implement a LRU (Least Recently Used) cache.",
    "Write a function to serialize and deserialize a binary tree.",
    "Implement a function to find all anagrams in a string.",
    "Write a function to find the longest increasing subsequence.",
    "Implement a function to find the longest common subsequence of two strings.",
    "Write a function to find the maximum subarray sum.",
    "Implement a function to find all possible word breaks.",
    "Write a function to find the longest valid parentheses."
  ]);

  // Randomly select 6 questions
  const selectedQuestions = React.useMemo(() => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Interview Questions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {selectedQuestions.map((question, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">
                {index + 1}. {question}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestions; 