import { api } from '.';
import { AnalysisResponse, ApiResponse, PlaceAnalysisResponse } from './type';

export const analysisApi = {
  /**
   * 1. 플레이스 분석 트리거 + 폴링
   */
  async getPlaceAnalysis(url: string) {
    const response = await api.get<ApiResponse<PlaceAnalysisResponse>>('/v1/place-analysis', {
      params: {
        url,
      },
    });

    return response.data;
  },

  /**
   * 2. 분석 결과 통합 조회
   */
  async getAnalysis(naverPlaceId: number) {
    const response = await api.get<ApiResponse<AnalysisResponse>>('/v1/openapi/analysis', {
      params: {
        naverPlaceId,
      },
    });

    return response.data;
  },
};
