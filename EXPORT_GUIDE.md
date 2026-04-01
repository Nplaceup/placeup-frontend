# 📦 PlaceUp 프로젝트 내보내기 및 배포 가이드

이 문서는 PlaceUp 프로젝트를 VS Code에서 설정하고 GitHub에 배포하는 전체 과정을 안내합니다.

## 📋 목차

1. [프로젝트 다운로드](#1-프로젝트-다운로드)
2. [VS Code에서 열기](#2-vs-code에서-열기)
3. [의존성 설치](#3-의존성-설치)
4. [로컬 실행](#4-로컬-실행)
5. [GitHub 배포](#5-github-배포)
6. [확인 사항](#6-확인-사항)

---

## 1️⃣ 프로젝트 다운로드

### 옵션 A: ZIP 파일로 다운로드 (추천)

1. Figma Make에서 "Export" 또는 "Download" 클릭
2. ZIP 파일 다운로드
3. 압축 해제
4. 폴더 이름을 `placeup`으로 변경

### 옵션 B: 직접 파일 복사

프로젝트의 모든 파일을 `placeup` 폴더에 복사합니다.

---

## 2️⃣ VS Code에서 열기

```bash
# 터미널에서
cd placeup
code .
```

또는:
1. VS Code 실행
2. **File** → **Open Folder**
3. `placeup` 폴더 선택

---

## 3️⃣ 의존성 설치

### VS Code 내장 터미널 열기
- **Mac**: `Cmd + J`
- **Windows/Linux**: `Ctrl + J`

### 패키지 설치

```bash
npm install
```

예상 시간: 2-5분

**설치 중 경고 무시:**
- `deprecated` 경고: 정상입니다
- `peer dependency` 경고: 정상입니다

---

## 4️⃣ 로컬 실행

### 개발 서버 시작

```bash
npm run dev
```

**성공 메시지:**
```
VITE v6.3.5  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 브라우저에서 확인

1. **http://localhost:5173** 접속
2. 로그인 페이지 확인
3. "네이버로 로그인" 버튼 클릭
4. 대시보드에서 테스트

**서버 종료:** `Ctrl + C`

---

## 5️⃣ GitHub 배포

### 5.1 GitHub 레포지토리 생성

1. **https://github.com** 로그인
2. 우측 상단 `+` → **New repository**
3. 레포지토리 설정:
   ```
   Repository name: placeup
   Description: 네이버 플레이스 SEO 분석 서비스
   Visibility: Public
   ❌ Initialize with README (체크 해제)
   ```
4. **Create repository** 클릭

### 5.2 Git 초기화 및 푸시

VS Code 터미널에서:

```bash
# Git 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: PlaceUp 프로젝트"

# 원격 저장소 연결 (본인의 username 사용)
git remote add origin https://github.com/YOUR_USERNAME/placeup.git

# 브랜치 이름 설정
git branch -M main

# GitHub에 푸시
git push -u origin main
```

**GitHub 인증:**
- Username 입력
- Personal Access Token 입력 (비밀번호 아님!)

**Personal Access Token 생성:**
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Scopes: `repo` 체크
5. Generate token → 복사 (한 번만 보임!)

### 5.3 GitHub Pages 설정

1. GitHub 레포지토리 페이지로 이동
2. **Settings** 탭 클릭
3. 좌측 **Pages** 클릭
4. **Source**에서 **GitHub Actions** 선택
5. **Actions** 탭으로 이동
6. "Deploy to GitHub Pages" 워크플로우 확인
7. 완료될 때까지 대기 (1-3분)

### 5.4 배포 URL 확인

**Settings → Pages**에서 URL 확인:
```
https://YOUR_USERNAME.github.io/placeup/
```

**⚠️ 중요:** 첫 배포 후 5-10분 정도 기다려야 할 수 있습니다.

---

## 6️⃣ 확인 사항

### ✅ 로컬 개발 체크리스트

- [ ] `npm install` 성공
- [ ] `npm run dev` 실행됨
- [ ] http://localhost:5173 접속 가능
- [ ] 로그인 페이지 표시
- [ ] 대시보드 이동 가능
- [ ] 분석 진행 페이지 동작
- [ ] 분석 결과 페이지 표시

### ✅ 배포 체크리스트

- [ ] GitHub 레포지토리 생성
- [ ] Git 푸시 성공
- [ ] GitHub Actions 워크플로우 성공
- [ ] GitHub Pages URL 접속 가능
- [ ] 모든 페이지 정상 작동
- [ ] 반응형 디자인 확인 (모바일/데스크탑)

---

## 🐛 문제 해결

### 문제 1: `npm install` 실패

**오류:** `EACCES` 권한 오류

**해결:**
```bash
# Mac/Linux
sudo npm install -g npm

# Windows (관리자 권한으로 실행)
npm install -g npm
```

### 문제 2: 포트 5173 사용 중

**오류:** `Port 5173 is already in use`

**해결:**
```bash
# 다른 포트 사용
npm run dev -- --port 3000
```

### 문제 3: Git 푸시 실패

**오류:** `Authentication failed`

**해결:**
1. Personal Access Token 생성 (위 참조)
2. Username: GitHub 사용자명
3. Password: Personal Access Token 입력

### 문제 4: GitHub Pages 404 오류

**원인:** 배포가 아직 완료되지 않음

**해결:**
1. **Actions** 탭에서 워크플로우 완료 확인
2. 5-10분 대기
3. 브라우저 캐시 삭제 후 재접속

### 문제 5: CSS가 적용되지 않음

**원인:** Base URL 설정 오류

**해결:**
1. `vite.config.ts` 확인
2. `base` 값이 올바른지 확인
3. 레포지토리 이름과 일치해야 함

---

## 📁 필수 파일 목록

배포에 필요한 모든 파일이 포함되어 있는지 확인:

```
✅ index.html
✅ package.json
✅ vite.config.ts
✅ .gitignore
✅ .github/workflows/deploy.yml
✅ src/main.tsx
✅ src/app/App.tsx
✅ src/app/routes.tsx
✅ src/app/pages/ (6개 페이지)
✅ src/app/components/
✅ src/app/services/api.ts
✅ src/app/data/mockData.ts
✅ src/styles/
```

---

## 🎯 다음 단계

### 1️⃣ 커스터마이징

**색상 변경:**
```css
/* src/styles/theme.css */
:root {
  --color-primary: #10b981; /* 원하는 색상으로 변경 */
}
```

**로고 변경:**
```typescript
// src/app/pages/LoginPage.tsx
<h1>PlaceUp</h1> // 원하는 이름으로 변경
```

### 2️⃣ Mock 데이터 수정

```typescript
// src/app/data/mockData.ts
export const mockPlaces = [
  {
    id: 'place1',
    name: '내 매장 이름', // 수정
    // ...
  },
];
```

### 3️⃣ 백엔드 연결 (향후)

```env
# .env 파일 생성
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://your-backend-api.com/api
```

---

## 📚 추가 문서

- 📖 [빠른 시작 가이드](./QUICK_START.md)
- 🏗️ [프로젝트 구조](./PROJECT_STRUCTURE.md)
- 🚀 [상세 배포 가이드](./DEPLOYMENT.md)
- 🔌 [API 명세서](./BACKEND_API_SPEC.md)

---

## 💬 지원

### GitHub Issues
버그나 기능 요청: https://github.com/YOUR_USERNAME/placeup/issues

### 문서
- README: 프로젝트 개요
- QUICK_START: 5분 설치 가이드
- DEPLOYMENT: 상세 배포 가이드
- PROJECT_STRUCTURE: 파일 구조 설명

---

## 🎉 완료!

축하합니다! PlaceUp이 성공적으로 배포되었습니다.

**배포 URL:** `https://YOUR_USERNAME.github.io/placeup/`

---

## 📝 체크리스트 요약

```bash
# 1. 프로젝트 폴더로 이동
cd placeup

# 2. 의존성 설치
npm install

# 3. 로컬 테스트
npm run dev

# 4. Git 설정
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/placeup.git
git push -u origin main

# 5. GitHub Pages 설정
# Settings → Pages → GitHub Actions

# 6. 배포 확인
# https://YOUR_USERNAME.github.io/placeup/
```

**모든 준비가 완료되었습니다!** 🚀
