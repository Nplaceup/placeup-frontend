# 🚀 PlaceUp 배포 가이드

이 문서는 PlaceUp 프로젝트를 GitHub Pages에 배포하는 방법을 설명합니다.

## 📋 배포 전 체크리스트

- [ ] GitHub 계정이 있어야 합니다
- [ ] Git이 설치되어 있어야 합니다
- [ ] Node.js 18 이상이 설치되어 있어야 합니다
- [ ] 프로젝트가 정상적으로 빌드되는지 확인했습니다 (`npm run build`)

## 🔧 1단계: GitHub 레포지토리 생성

### 1.1 GitHub에서 새 레포지토리 생성

1. GitHub에 로그인
2. 우측 상단 `+` 버튼 클릭 → "New repository"
3. 레포지토리 정보 입력:
   - **Repository name**: `placeup` (원하는 이름으로 변경 가능)
   - **Description**: "네이버 플레이스 SEO 분석 및 키워드 추천 서비스"
   - **Visibility**: Public (GitHub Pages는 Public 레포에서 무료)
   - ⚠️ **DO NOT** initialize with README, .gitignore, or license (이미 로컬에 있음)
4. "Create repository" 클릭

### 1.2 로컬 프로젝트와 연결

```bash
# Git 초기화 (아직 안 했다면)
git init

# GitHub 원격 저장소 추가
git remote add origin https://github.com/yourusername/placeup.git

# 브랜치 이름을 main으로 설정
git branch -M main

# 첫 커밋
git add .
git commit -m "Initial commit: PlaceUp 프로젝트 설정"

# GitHub에 푸시
git push -u origin main
```

## ⚙️ 2단계: GitHub Pages 설정

### 2.1 GitHub Actions 활성화

1. GitHub 레포지토리 페이지로 이동
2. **Settings** 탭 클릭
3. 좌측 사이드바에서 **Pages** 클릭
4. **Source** 섹션에서:
   - "Deploy from a branch" 대신 **"GitHub Actions"** 선택

### 2.2 Actions 권한 설정

1. **Settings** → **Actions** → **General**
2. "Workflow permissions" 섹션에서:
   - ✅ **"Read and write permissions"** 선택
   - ✅ **"Allow GitHub Actions to create and approve pull requests"** 체크
3. **Save** 클릭

## 🌐 3단계: Base URL 설정

### 옵션 A: 서브도메인 사용 (기본)

레포지토리 이름이 URL에 포함됩니다: `https://yourusername.github.io/placeup/`

**vite.config.ts** 파일이 자동으로 처리하므로 추가 설정 불필요!

### 옵션 B: 커스텀 도메인 사용

만약 `yourusername.github.io` 형태로 사용하려면:

1. 레포지토리 이름을 `yourusername.github.io`로 변경
2. **vite.config.ts** 수정:
   ```typescript
   base: '/',
   ```

## 🎬 4단계: 배포 실행

### 자동 배포 (권장)

코드를 `main` 브랜치에 푸시하면 자동으로 배포됩니다:

```bash
git add .
git commit -m "배포 준비 완료"
git push origin main
```

### 배포 진행 상황 확인

1. GitHub 레포지토리의 **Actions** 탭으로 이동
2. "Deploy to GitHub Pages" 워크플로우 클릭
3. 진행 상황 확인 (약 1-3분 소요)

### 배포 URL 확인

배포가 완료되면:
- **Settings** → **Pages**에서 배포 URL 확인
- 또는 Actions 탭에서 워크플로우 완료 후 URL 확인

## 🔍 5단계: 배포 확인

1. 브라우저에서 배포 URL 접속
   - 예: `https://yourusername.github.io/placeup/`
2. 모든 페이지가 정상 작동하는지 확인:
   - ✅ 로그인 페이지
   - ✅ 대시보드
   - ✅ 분석 진행 페이지
   - ✅ 분석 결과 페이지
3. 반응형 디자인 확인 (모바일/태블릿/데스크탑)

## 🐛 트러블슈팅

### 문제 1: 404 Not Found

**증상**: 메인 페이지는 로드되지만 새로고침 시 404 에러

**해결책**: SPA 라우팅 문제입니다. `dist/` 폴더에 `.nojekyll` 파일 추가:

```bash
# 빌드 스크립트 수정 (package.json)
"build": "vite build && touch dist/.nojekyll"
```

또는 GitHub Actions 워크플로우에 추가됨 (이미 설정되어 있음)

### 문제 2: CSS가 로드되지 않음

**증상**: 페이지는 보이지만 스타일이 깨짐

**해결책**: Base URL 설정 확인

1. **vite.config.ts**에서 `base` 값 확인
2. 레포지토리 이름과 일치하는지 확인

### 문제 3: GitHub Actions 실패

**증상**: Actions 탭에서 빌드 실패 표시

**해결책**:

1. Actions 탭에서 실패한 워크플로우 클릭
2. 로그 확인하여 오류 원인 파악
3. 주요 원인:
   - Node.js 버전 불일치: `package.json`에서 engines 확인
   - 의존성 문제: `npm ci` 대신 `npm install` 시도
   - 환경 변수 누락: `.env` 파일 확인

### 문제 4: 환경 변수가 작동하지 않음

**증상**: API 호출이 실패하거나 Mock 데이터가 표시되지 않음

**해결책**: GitHub Secrets 설정

1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. 환경 변수 추가:
   - `VITE_API_BASE_URL`: API 서버 URL
   - `VITE_USE_MOCK_DATA`: `true` 또는 `false`

## 🔄 업데이트 배포

코드를 수정한 후:

```bash
# 변경사항 커밋
git add .
git commit -m "기능 추가/수정"

# GitHub에 푸시 (자동 배포됨)
git push origin main
```

약 1-3분 후 변경사항이 자동으로 배포됩니다.

## 📊 배포 상태 확인

### 상태 뱃지 추가

README.md에 배포 상태 뱃지를 추가할 수 있습니다:

```markdown
![Deploy Status](https://github.com/yourusername/placeup/actions/workflows/deploy.yml/badge.svg)
```

## 🎯 성능 최적화

### 빌드 최적화

**vite.config.ts**에 다음 옵션 추가 (선택사항):

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router'],
        'charts': ['recharts'],
        'icons': ['lucide-react'],
      },
    },
  },
  chunkSizeWarningLimit: 1000,
},
```

## 📱 커스텀 도메인 연결 (선택사항)

### 도메인 구매 후:

1. **Settings** → **Pages**
2. **Custom domain** 섹션에 도메인 입력 (예: `placeup.com`)
3. DNS 설정:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```
4. **Enforce HTTPS** 체크 (24-48시간 후)

## 🔐 보안 설정

### HTTPS 강제 적용

- GitHub Pages는 자동으로 HTTPS를 제공합니다
- **Settings** → **Pages**에서 "Enforce HTTPS" 옵션 확인

### API 키 보호

- 절대 `.env` 파일을 커밋하지 마세요
- `.gitignore`에 `.env` 추가 확인
- GitHub Secrets를 사용하여 민감한 정보 관리

## 📚 추가 리소스

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)

## 💡 팁

1. **브랜치 보호**: `main` 브랜치에 protection rule 설정
2. **자동 테스트**: GitHub Actions에 테스트 단계 추가
3. **미리보기**: PR마다 미리보기 배포 설정 가능
4. **분석 도구**: Google Analytics 추가 고려

## 🎉 배포 완료!

축하합니다! PlaceUp이 성공적으로 배포되었습니다.

배포 URL: `https://yourusername.github.io/placeup/`

---

**문제가 발생하면?**
- GitHub Issues에 문의
- Actions 로그 확인
- 이 가이드의 트러블슈팅 섹션 참조
