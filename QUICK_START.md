# ⚡ PlaceUp 빠른 시작 가이드

5분 안에 PlaceUp을 로컬에서 실행하는 방법을 안내합니다.

## 📋 사전 요구사항

- ✅ **Node.js 18 이상** ([다운로드](https://nodejs.org/))
- ✅ **Git** ([다운로드](https://git-scm.com/))
- ✅ **코드 에디터** (VS Code 권장)

버전 확인:
```bash
node --version  # v18.0.0 이상
npm --version   # v9.0.0 이상
```

## 🚀 3단계 설치

### 1️⃣ 프로젝트 클론

```bash
# HTTPS
git clone https://github.com/yourusername/placeup.git
cd placeup

# 또는 SSH
git clone git@github.com:yourusername/placeup.git
cd placeup
```

### 2️⃣ 의존성 설치

```bash
npm install
```

**또는 pnpm 사용 (더 빠름):**
```bash
npm install -g pnpm
pnpm install
```

### 3️⃣ 개발 서버 실행

```bash
npm run dev
```

브라우저에서 **http://localhost:5173** 접속! 🎉

## 🎯 빠른 테스트

1. **로그인 페이지** (`/`)
   - "네이버로 로그인" 버튼 클릭
   
2. **대시보드** (`/dashboard`)
   - 아무 텍스트나 입력 (예: "테스트")
   - "분석 시작" 버튼 클릭
   
3. **분석 진행** (자동 이동)
   - 6단계 분석 과정 애니메이션 확인
   
4. **분석 결과** (자동 이동)
   - SEO 점수, 키워드 추천, 경쟁사 분석 확인

## 🔧 환경 변수 설정 (선택사항)

프로젝트 루트에 `.env` 파일 생성:

```env
# Mock 데이터 사용 (백엔드 없이 작동)
VITE_USE_MOCK_DATA=true

# API 서버 URL (향후 백엔드 연결 시)
VITE_API_BASE_URL=http://localhost:8080/api

# 네이버 OAuth (향후 설정)
VITE_NAVER_CLIENT_ID=
VITE_NAVER_REDIRECT_URI=http://localhost:5173/auth/callback
```

**현재는 Mock 데이터로 작동**하므로 `.env` 파일 없이도 실행 가능합니다!

## 📂 프로젝트 구조 (핵심만)

```
placeup/
├── src/
│   ├── app/
│   │   ├── pages/          # 6개 페이지
│   │   ├── components/     # 공통 컴포넌트
│   │   ├── services/       # API (Mock 데이터 포함)
│   │   └── App.tsx         # 메인 앱
│   └── styles/             # 스타일 (Tailwind CSS)
├── index.html
└── package.json
```

## 🎨 개발 팁

### Hot Reload 활성화
코드를 수정하면 자동으로 브라우저가 새로고침됩니다.

### 다른 포트 사용
```bash
npm run dev -- --port 3000
```

### 빌드 테스트
```bash
npm run build
npm run preview
```

## 🐛 문제 해결

### 포트 5173이 이미 사용 중

**오류**: `Port 5173 is in use`

**해결**:
```bash
# 프로세스 종료
npx kill-port 5173

# 또는 다른 포트 사용
npm run dev -- --port 3000
```

### 의존성 설치 실패

**오류**: `npm install` 실패

**해결**:
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# 또는 캐시 클리어
npm cache clean --force
npm install
```

### 빌드 오류

**오류**: `npm run build` 실패

**해결**:
```bash
# TypeScript 오류 확인
npx tsc --noEmit

# 의존성 재설치
rm -rf node_modules
npm install
npm run build
```

### Mock 데이터가 표시되지 않음

**확인**:
1. `.env` 파일에서 `VITE_USE_MOCK_DATA=true` 설정
2. 브라우저 콘솔에서 오류 확인 (F12)
3. 개발 서버 재시작

## 📱 반응형 테스트

### 브라우저 개발자 도구
1. **F12** 또는 **Ctrl+Shift+I** (Windows/Linux)
2. **Cmd+Option+I** (Mac)
3. 모바일 뷰 토글 버튼 클릭
4. 다양한 디바이스 크기 테스트

### 지원 화면 크기
- 📱 모바일: 320px ~ 768px
- 📱 태블릿: 768px ~ 1024px
- 💻 데스크탑: 1024px 이상

## 🎭 Mock 데이터 커스터마이징

`src/app/data/mockData.ts` 파일 수정:

```typescript
export const mockPlaces: Place[] = [
  {
    id: 'place1',
    name: '내 카페',  // 원하는 이름으로 변경
    category: '카페',
    // ... 기타 정보
  },
];
```

개발 서버가 자동으로 재로드됩니다!

## 🔍 VS Code 확장 프로그램 (권장)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",        // ESLint
    "esbenp.prettier-vscode",        // Prettier
    "bradlc.vscode-tailwindcss",     // Tailwind CSS IntelliSense
    "ms-vscode.vscode-typescript-next" // TypeScript
  ]
}
```

`.vscode/extensions.json` 파일로 저장하면 팀원에게 자동 추천됩니다.

## 📚 다음 단계

1. 📖 [프로젝트 구조 상세 가이드](./PROJECT_STRUCTURE.md)
2. 🚀 [GitHub Pages 배포](./DEPLOYMENT.md)
3. 🔧 [백엔드 연결 가이드](./BACKEND_API_SPEC.md)
4. 🎨 [디자인 커스터마이징](./src/styles/theme.css)

## 💬 커뮤니티

- 🐛 **버그 리포트**: [GitHub Issues](https://github.com/yourusername/placeup/issues)
- 💡 **기능 제안**: [GitHub Discussions](https://github.com/yourusername/placeup/discussions)
- 📧 **이메일**: your-email@example.com

## ⚡ 요약

```bash
# 1. 클론
git clone https://github.com/yourusername/placeup.git
cd placeup

# 2. 설치
npm install

# 3. 실행
npm run dev

# 4. 접속
# http://localhost:5173
```

**그게 전부입니다! 🎉**

---

**즐거운 개발 되세요!** 🚀
