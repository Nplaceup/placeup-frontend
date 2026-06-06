import { api } from '.';
import { AnalysisResponse, ApiResponse, PlaceAnalysisResponse } from './type';

export const analysisApi = {
  /**
   * 1. POST /v1/place-analysis — 분석 트리거
   * 네이버 플레이스 URL을 전송해 분석을 시작한다.
   */
  async triggerAnalysis(url: string) {
    const response = await api.post<ApiResponse<PlaceAnalysisResponse>>('/v1/place-analysis', url, {
      headers: { 'Content-Type': 'text/plain' },
    });

    return response.data;
  },

  /**
   * 2. GET /v1/place-analysis/status — 분석 상태 폴링 + 결과 조회
   * analyzing: true → 진행 중 / analyzing: false → 완료 (결과 포함)
   */
  async getAnalysisStatus(naverPlaceId: number) {
    const response = await api.get<ApiResponse<AnalysisResponse>>('/v1/place-analysis/status', {
      params: { naverPlaceId },
    });

    return response.data;
  },
};