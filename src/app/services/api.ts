// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false'; // 기본값: true (mock 사용)

// API 응답 타입 정의
export interface PlaceAnalysisRequest {
  placeUrl: string;
  userId?: string;
}

export interface PlaceAnalysisResponse {
  analysisId: string;
  placeId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedTime?: number; // 예상 소요 시간 (초)
}

export interface PlaceInfo {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
}

export interface AnalysisResult {
  placeId: string;
  placeName: string;
  seoScore: number;
  keywords: KeywordRecommendation[];
  competitors: CompetitorInfo[];
  seoDetails: {
    titleScore: number;
    descriptionScore: number;
    reviewScore: number;
    photoScore: number;
    responseScore: number;
  };
  recommendations: string[];
  analyzedAt: string;
}

export interface KeywordRecommendation {
  keyword: string;
  score: number;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  currentRank?: number;
  recommendedRank?: number;
}

export interface CompetitorInfo {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  rank: number;
  seoScore: number;
}

export interface KeywordRankingData {
  keyword: string;
  currentRank: number;
  previousRank: number;
  change: number;
  searchVolume: number;
  history: { date: string; rank: number }[];
}

export interface UserPlace {
  id: string;
  name: string;
  category: string;
  address: string;
  seoScore: number;
  lastAnalyzed: string;
  status: 'active' | 'inactive';
}

// API 클라이언트 클래스
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }

  // 네이버 OAuth 로그인
  async naverLogin(code: string): Promise<{ token: string; user: any }> {
    if (USE_MOCK_DATA) {
      return this.mockNaverLogin();
    }
    return this.request('/auth/naver', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // 플레이스 분석 시작
  async startPlaceAnalysis(
    request: PlaceAnalysisRequest
  ): Promise<PlaceAnalysisResponse> {
    if (USE_MOCK_DATA) {
      return this.mockStartAnalysis(request);
    }
    return this.request('/places/analyze', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // 분석 상태 확인
  async getAnalysisStatus(analysisId: string): Promise<PlaceAnalysisResponse> {
    if (USE_MOCK_DATA) {
      return this.mockGetAnalysisStatus(analysisId);
    }
    return this.request(`/analysis/${analysisId}/status`);
  }

  // 플레이스 정보 조회
  async getPlaceInfo(placeId: string): Promise<PlaceInfo> {
    if (USE_MOCK_DATA) {
      return this.mockGetPlaceInfo(placeId);
    }
    return this.request(`/places/${placeId}`);
  }

  // 분석 결과 조회
  async getAnalysisResult(placeId: string): Promise<AnalysisResult> {
    if (USE_MOCK_DATA) {
      return this.mockGetAnalysisResult(placeId);
    }
    return this.request(`/places/${placeId}/analysis`);
  }

  // 키워드 순위 조회
  async getKeywordRankings(placeId: string): Promise<KeywordRankingData[]> {
    if (USE_MOCK_DATA) {
      return this.mockGetKeywordRankings(placeId);
    }
    return this.request(`/places/${placeId}/keywords/ranking`);
  }

  // 내 매장 목록 조회
  async getUserPlaces(userId: string): Promise<UserPlace[]> {
    if (USE_MOCK_DATA) {
      return this.mockGetUserPlaces(userId);
    }
    return this.request(`/users/${userId}/places`);
  }

  // 매장 정보 수정
  async updatePlace(placeId: string, data: Partial<PlaceInfo>): Promise<void> {
    if (USE_MOCK_DATA) {
      return this.mockUpdatePlace(placeId, data);
    }
    return this.request(`/places/${placeId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Mock 데이터 메서드들
  private async mockNaverLogin(): Promise<{ token: string; user: any }> {
    await this.delay(500);
    return {
      token: 'mock-jwt-token-12345',
      user: {
        id: 'user1',
        name: '김플레이스',
        email: 'user@naver.com',
        profileImage: '',
      },
    };
  }

  private async mockStartAnalysis(
    request: PlaceAnalysisRequest
  ): Promise<PlaceAnalysisResponse> {
    await this.delay(800);
    
    // URL에서 플레이스 ID 추출 시도 (실제로는 백엔드에서 처리)
    const placeId = request.placeUrl.includes('place1') ? 'place1' : 'place2';
    
    return {
      analysisId: `analysis-${Date.now()}`,
      placeId: placeId,
      status: 'processing',
      estimatedTime: 30,
    };
  }

  private async mockGetAnalysisStatus(
    analysisId: string
  ): Promise<PlaceAnalysisResponse> {
    await this.delay(300);
    return {
      analysisId,
      placeId: 'place1',
      status: 'completed',
    };
  }

  private async mockGetPlaceInfo(placeId: string): Promise<PlaceInfo> {
    await this.delay(500);
    
    const mockPlaces: Record<string, PlaceInfo> = {
      place1: {
        id: 'place1',
        name: '강남 맛집 카페',
        category: '카페',
        address: '서울시 강남구 테헤란로 123',
        phone: '02-1234-5678',
        rating: 4.5,
        reviewCount: 342,
        images: [],
        description: '강남역 근처 분위기 좋은 카페입니다.',
      },
      place2: {
        id: 'place2',
        name: '이태원 파스타하우스',
        category: '이탈리안 레스토랑',
        address: '서울시 용산구 이태원로 456',
        phone: '02-9876-5432',
        rating: 4.7,
        reviewCount: 589,
        images: [],
        description: '정통 이탈리안 파스타 전문점',
      },
    };

    return mockPlaces[placeId] || mockPlaces.place1;
  }

  private async mockGetAnalysisResult(placeId: string): Promise<AnalysisResult> {
    await this.delay(700);
    
    const mockResults: Record<string, AnalysisResult> = {
      place1: {
        placeId: 'place1',
        placeName: '강남 맛집 카페',
        seoScore: 78,
        keywords: [
          {
            keyword: '강남 카페',
            score: 92,
            searchVolume: 12500,
            competition: 'high',
            currentRank: 15,
            recommendedRank: 5,
          },
          {
            keyword: '강남역 브런치',
            score: 85,
            searchVolume: 8900,
            competition: 'medium',
            currentRank: 8,
            recommendedRank: 3,
          },
          {
            keyword: '테헤란로 디저트',
            score: 78,
            searchVolume: 4200,
            competition: 'low',
            currentRank: 12,
            recommendedRank: 5,
          },
        ],
        competitors: [
          {
            id: 'comp1',
            name: '강남 스타벅스',
            rating: 4.3,
            reviewCount: 892,
            distance: '200m',
            rank: 1,
            seoScore: 95,
          },
          {
            id: 'comp2',
            name: '테헤란 커피숍',
            rating: 4.4,
            reviewCount: 567,
            distance: '350m',
            rank: 2,
            seoScore: 88,
          },
        ],
        seoDetails: {
          titleScore: 85,
          descriptionScore: 75,
          reviewScore: 82,
          photoScore: 70,
          responseScore: 65,
        },
        recommendations: [
          '업체명에 "강남역" 키워드를 추가하세요',
          '메뉴 설명을 더 상세하게 작성하세요',
          '리뷰에 적극적으로 답변하세요',
          '고품질 사진을 10장 이상 등록하세요',
        ],
        analyzedAt: new Date().toISOString(),
      },
      place2: {
        placeId: 'place2',
        placeName: '이태원 파스타하우스',
        seoScore: 85,
        keywords: [
          {
            keyword: '이태원 파스타',
            score: 95,
            searchVolume: 15200,
            competition: 'medium',
            currentRank: 3,
            recommendedRank: 1,
          },
          {
            keyword: '용산 이탈리안',
            score: 88,
            searchVolume: 7800,
            competition: 'low',
            currentRank: 5,
            recommendedRank: 2,
          },
        ],
        competitors: [
          {
            id: 'comp3',
            name: '이태원 파스타킹',
            rating: 4.6,
            reviewCount: 723,
            distance: '300m',
            rank: 1,
            seoScore: 92,
          },
        ],
        seoDetails: {
          titleScore: 90,
          descriptionScore: 85,
          reviewScore: 88,
          photoScore: 80,
          responseScore: 78,
        },
        recommendations: [
          '시그니처 메뉴 사진을 추가하세요',
          '영업시간을 정확하게 업데이트하세요',
        ],
        analyzedAt: new Date().toISOString(),
      },
    };

    return mockResults[placeId] || mockResults.place1;
  }

  private async mockGetKeywordRankings(
    placeId: string
  ): Promise<KeywordRankingData[]> {
    await this.delay(600);
    
    return [
      {
        keyword: '강남 카페',
        currentRank: 15,
        previousRank: 18,
        change: 3,
        searchVolume: 12500,
        history: [
          { date: '2026-03-01', rank: 20 },
          { date: '2026-03-08', rank: 18 },
          { date: '2026-03-15', rank: 16 },
          { date: '2026-03-22', rank: 15 },
        ],
      },
      {
        keyword: '강남역 브런치',
        currentRank: 8,
        previousRank: 12,
        change: 4,
        searchVolume: 8900,
        history: [
          { date: '2026-03-01', rank: 15 },
          { date: '2026-03-08', rank: 12 },
          { date: '2026-03-15', rank: 10 },
          { date: '2026-03-22', rank: 8 },
        ],
      },
      {
        keyword: '테헤란로 디저트',
        currentRank: 12,
        previousRank: 11,
        change: -1,
        searchVolume: 4200,
        history: [
          { date: '2026-03-01', rank: 10 },
          { date: '2026-03-08', rank: 11 },
          { date: '2026-03-15', rank: 11 },
          { date: '2026-03-22', rank: 12 },
        ],
      },
    ];
  }

  private async mockGetUserPlaces(userId: string): Promise<UserPlace[]> {
    await this.delay(500);
    
    return [
      {
        id: 'place1',
        name: '강남 맛집 카페',
        category: '카페',
        address: '서울시 강남구 테헤란로 123',
        seoScore: 78,
        lastAnalyzed: '2026-03-28T10:30:00Z',
        status: 'active',
      },
      {
        id: 'place2',
        name: '이태원 파스타하우스',
        category: '이탈리안',
        address: '서울시 용산구 이태원로 456',
        seoScore: 85,
        lastAnalyzed: '2026-03-27T15:20:00Z',
        status: 'active',
      },
    ];
  }

  private async mockUpdatePlace(
    placeId: string,
    data: Partial<PlaceInfo>
  ): Promise<void> {
    await this.delay(400);
    console.log('Mock: Place updated', placeId, data);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// API 클라이언트 싱글톤 인스턴스
export const apiClient = new ApiClient();
