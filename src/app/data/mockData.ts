export interface Place {
  id: string;
  name: string;
  url: string;
  category: string;
  address: string;
  description: string;
  rating: number;
  reviewCount: number;
  registeredDate: string;
}

export interface KeywordRecommendation {
  keyword: string;
  priority: number;
  searchVolume: number;
  frequency: number;
  differentiationScore: number;
  source: "review" | "description" | "category";
}

export interface SEOScore {
  total: number;
  details: {
    category: string;
    score: number;
    maxScore: number;
    status: "good" | "warning" | "poor";
  }[];
}

export interface CompetitorData {
  name: string;
  rank: number;
  seoScore: number;
  keywords: string[];
  reviewCount: number;
}

export interface KeywordRankData {
  keyword: string;
  rank: number;
  searchVolume: number;
  change: number;
}

// Mock 사용자 데이터
export const mockUser = {
  id: "user123",
  name: "김사장",
  email: "kimsajang@naver.com",
};

// Mock 플레이스 데이터
export const mockPlaces: Place[] = [
  {
    id: "place1",
    name: "강남 맛집 카페",
    url: "https://m.place.naver.com/restaurant/123456",
    category: "카페",
    address: "서울 강남구 역삼동 123-45",
    description: "신선한 원두와 수제 디저트를 제공하는 아늑한 카페입니다",
    rating: 4.5,
    reviewCount: 342,
    registeredDate: "2026-01-15",
  },
  {
    id: "place2",
    name: "이태원 파스타하우스",
    url: "https://m.place.naver.com/restaurant/234567",
    category: "이탈리안 레스토랑",
    address: "서울 용산구 이태원동 234-56",
    description: "정통 이탈리안 파스타와 피자를 제공하는 레스토랑",
    rating: 4.7,
    reviewCount: 567,
    registeredDate: "2025-11-20",
  },
];

// Mock 키워드 추천 데이터
export const mockKeywordRecommendations: Record<string, KeywordRecommendation[]> = {
  place1: [
    {
      keyword: "강남 디저트 카페",
      priority: 1,
      searchVolume: 12500,
      frequency: 89,
      differentiationScore: 85,
      source: "review",
    },
    {
      keyword: "역삼 브런치 카페",
      priority: 2,
      searchVolume: 8900,
      frequency: 67,
      differentiationScore: 78,
      source: "review",
    },
    {
      keyword: "강남 수제 디저트",
      priority: 3,
      searchVolume: 7200,
      frequency: 54,
      differentiationScore: 72,
      source: "description",
    },
    {
      keyword: "역삼 아메리카노",
      priority: 4,
      searchVolume: 5600,
      frequency: 45,
      differentiationScore: 68,
      source: "review",
    },
    {
      keyword: "강남 조용한 카페",
      priority: 5,
      searchVolume: 4800,
      frequency: 38,
      differentiationScore: 65,
      source: "review",
    },
  ],
  place2: [
    {
      keyword: "이태원 파스타 맛집",
      priority: 1,
      searchVolume: 15200,
      frequency: 94,
      differentiationScore: 88,
      source: "review",
    },
    {
      keyword: "이태원 정통 이탈리안",
      priority: 2,
      searchVolume: 11400,
      frequency: 78,
      differentiationScore: 82,
      source: "description",
    },
    {
      keyword: "용산 피자 맛집",
      priority: 3,
      searchVolume: 9200,
      frequency: 65,
      differentiationScore: 75,
      source: "review",
    },
    {
      keyword: "이태원 데이트 레스토랑",
      priority: 4,
      searchVolume: 7800,
      frequency: 52,
      differentiationScore: 70,
      source: "review",
    },
    {
      keyword: "용산 이탈리안 레스토랑",
      priority: 5,
      searchVolume: 6500,
      frequency: 43,
      differentiationScore: 67,
      source: "category",
    },
  ],
};

// Mock SEO 점수 데이터
export const mockSEOScores: Record<string, SEOScore> = {
  place1: {
    total: 72,
    details: [
      {
        category: "키워드 최적화",
        score: 18,
        maxScore: 25,
        status: "warning",
      },
      {
        category: "매장 정보 완성도",
        score: 22,
        maxScore: 25,
        status: "good",
      },
      {
        category: "리뷰 품질",
        score: 15,
        maxScore: 20,
        status: "warning",
      },
      {
        category: "사진 및 메뉴",
        score: 12,
        maxScore: 15,
        status: "good",
      },
      {
        category: "업데이트 빈도",
        score: 5,
        maxScore: 15,
        status: "poor",
      },
    ],
  },
  place2: {
    total: 85,
    details: [
      {
        category: "키워드 최적화",
        score: 22,
        maxScore: 25,
        status: "good",
      },
      {
        category: "매장 정보 완성도",
        score: 23,
        maxScore: 25,
        status: "good",
      },
      {
        category: "리뷰 품질",
        score: 18,
        maxScore: 20,
        status: "good",
      },
      {
        category: "사진 및 메뉴",
        score: 13,
        maxScore: 15,
        status: "good",
      },
      {
        category: "업데이트 빈도",
        score: 9,
        maxScore: 15,
        status: "warning",
      },
    ],
  },
};

// Mock 경쟁사 데이터
export const mockCompetitors: Record<string, CompetitorData[]> = {
  place1: [
    {
      name: "역삼 프리미엄 카페",
      rank: 1,
      seoScore: 88,
      keywords: ["강남 디저트", "역삼 브런치", "강남 베이커리"],
      reviewCount: 521,
    },
    {
      name: "강남 로스터리 카페",
      rank: 2,
      seoScore: 82,
      keywords: ["강남 스페셜티", "역삼 원두", "강남 핸드드립"],
      reviewCount: 438,
    },
    {
      name: "역삼 디저트 공방",
      rank: 3,
      seoScore: 76,
      keywords: ["강남 수제케이크", "역삼 마카롱", "강남 디저트"],
      reviewCount: 389,
    },
  ],
  place2: [
    {
      name: "이태원 트라토리아",
      rank: 1,
      seoScore: 92,
      keywords: ["이태원 파스타", "용산 정통 이탈리안", "이태원 피자"],
      reviewCount: 678,
    },
    {
      name: "용산 이탈리아 키친",
      rank: 2,
      seoScore: 87,
      keywords: ["용산 파스타 맛집", "이태원 이탈리안", "용산 피자"],
      reviewCount: 592,
    },
    {
      name: "이태원 파스타 공방",
      rank: 3,
      seoScore: 79,
      keywords: ["이태원 수제 파스타", "용산 파스타", "이태원 맛집"],
      reviewCount: 456,
    },
  ],
};

// Mock 키워드 순위 데이터
export const mockKeywordRanks: Record<string, KeywordRankData[]> = {
  place1: [
    {
      keyword: "강남 디저트 카페",
      rank: 4,
      searchVolume: 12500,
      change: 1,
    },
    {
      keyword: "역삼 브런치 카페",
      rank: 7,
      searchVolume: 8900,
      change: -2,
    },
    {
      keyword: "강남 수제 디저트",
      rank: 12,
      searchVolume: 7200,
      change: 3,
    },
    {
      keyword: "역삼 아메리카노",
      rank: 18,
      searchVolume: 5600,
      change: 0,
    },
  ],
  place2: [
    {
      keyword: "이태원 파스타 맛집",
      rank: 2,
      searchVolume: 15200,
      change: 1,
    },
    {
      keyword: "이태원 정통 이탈리안",
      rank: 5,
      searchVolume: 11400,
      change: 0,
    },
    {
      keyword: "용산 피자 맛집",
      rank: 8,
      searchVolume: 9200,
      change: 2,
    },
    {
      keyword: "이태원 데이트 레스토랑",
      rank: 11,
      searchVolume: 7800,
      change: -1,
    },
  ],
};

// Mock 리뷰 데이터
export const mockReviews: Record<string, string[]> = {
  place1: [
    "디저트가 정말 맛있어요! 특히 티라미수가 일품입니다.",
    "조용하고 아늑한 분위기가 좋아요. 작업하기 좋은 카페예요.",
    "커피 맛이 훌륭하고 수제 케이크도 신선해요.",
    "브런치 메뉴가 다양하고 맛있습니다. 재방문 의사 있어요!",
    "인테리어가 예쁘고 사진 찍기 좋아요. 디저트도 맛있구요.",
  ],
  place2: [
    "정통 이탈리안 파스타 맛집! 면 식감이 완벽해요.",
    "피자 도우가 쫄깃하고 토핑이 신선합니다.",
    "데이트하기 딱 좋은 분위기예요. 음식도 훌륭하고요.",
    "까르보나라가 크리미하고 맛있어요. 강력 추천합니다!",
    "이태원에서 제일 맛있는 파스타집 같아요. 재방문 100%",
  ],
};
