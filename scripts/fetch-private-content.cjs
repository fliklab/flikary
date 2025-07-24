#!/usr/bin/env node

/**
 * 이 스크립트는 프라이빗 레포에서 콘텐츠를 가져와서 임의의 URL로 접근 가능한 프라이빗 페이지를 생성합니다.
 * 필요한 환경 변수:
 * - PRIVATE_REPO_URL: 프라이빗 레포 URL (예: https://github.com/username/private-repo.git)
 * - PRIVATE_REPO_TOKEN: 프라이빗 레포에 접근하기 위한 개인 액세스 토큰
 * - PRIVATE_CONTENT_PATH: 프라이빗 레포 내의 콘텐츠 경로
 * - PRIVATE_CONFIG_FILE: 프라이빗 페이지 구성 파일 (기본값: private-pages.json)
 */


const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 환경 변수 로드
require('dotenv').config();

const PRIVATE_REPO_URL = process.env.PRIVATE_REPO_URL;
const PRIVATE_REPO_TOKEN = process.env.PRIVATE_REPO_TOKEN;
const PRIVATE_CONTENT_PATH = process.env.PRIVATE_CONTENT_PATH || '';
const PRIVATE_CONFIG_FILE = process.env.PRIVATE_CONFIG_FILE || 'private-pages.json';
const TMP_DIR = path.join(__dirname, '../.tmp-private-repo');
const PRIVATE_PAGES_DIR = path.join(__dirname, '../src/pages/p');

// 에러 처리 함수 - 빌드 실패를 방지하기 위해 process.exit 제거
function handleError(message) {
  console.error(`❌ 오류: ${message}`);
  console.log('⚠️ 프라이빗 콘텐츠 가져오기를 건너뛰고 빌드를 계속 진행합니다.');
  return false; // 오류 발생을 나타내는 반환값
}

// 임시 디렉토리 정리
function cleanupTmpDir() {
  if (fs.existsSync(TMP_DIR)) {
    try {
      execSync(`rm -rf ${TMP_DIR}`);
      console.log('🧹 임시 디렉토리 정리 완료');
    } catch (err) {
      console.warn(`⚠️ 임시 디렉토리 정리 실패: ${err.message}`);
    }
  }
}

// 날짜가 만료되었는지 확인하는 함수
function isExpired(expiryDateStr) {
  if (!expiryDateStr) return false; // 만료일이 없으면 만료되지 않음
  
  const expiryDate = new Date(expiryDateStr);
  const currentDate = new Date();
  
  return currentDate > expiryDate;
}

// 메인 함수
async function main() {
  console.log('🚀 프라이빗 레포에서 콘텐츠 가져오기 시작');

  // 환경 변수 확인
  if (!PRIVATE_REPO_URL) {
    handleError('PRIVATE_REPO_URL 환경 변수가 설정되지 않았습니다.');
    return;
  }

  if (!PRIVATE_REPO_TOKEN) {
    handleError('PRIVATE_REPO_TOKEN 환경 변수가 설정되지 않았습니다.');
    return;
  }

  // 임시 디렉토리 생성 및 기존 디렉토리 정리
  cleanupTmpDir();
  fs.mkdirSync(TMP_DIR, { recursive: true });

  // private pages 디렉토리 생성 또는 비우기
  if (!fs.existsSync(PRIVATE_PAGES_DIR)) {
    fs.mkdirSync(PRIVATE_PAGES_DIR, { recursive: true });
    console.log('📁 private pages 디렉토리 생성됨');
  } else {
    // 기존 private pages 디렉토리 비우기
    const files = fs.readdirSync(PRIVATE_PAGES_DIR);
    for (const file of files) {
      const filePath = path.join(PRIVATE_PAGES_DIR, file);
      if (file !== '.gitkeep' && !fs.statSync(filePath).isDirectory()) {
        fs.unlinkSync(filePath);
      }
    }
    console.log('📁 private pages 디렉토리 비움');
  }

  try {
    // GitHub 인증 포함된 URL 형식 생성
    const authRepoUrl = PRIVATE_REPO_URL.replace(
      'https://',
      `https://${PRIVATE_REPO_TOKEN}@`
    );

    // 프라이빗 레포 클론
    console.log('📥 프라이빗 레포 클론 중...');
    execSync(`git clone --depth 1 ${authRepoUrl} ${TMP_DIR}`, { stdio: 'pipe' });
    
    // 프라이빗 콘텐츠 경로 확인
    const contentBasePath = path.join(TMP_DIR, PRIVATE_CONTENT_PATH);
    if (!fs.existsSync(contentBasePath)) {
      handleError(`프라이빗 콘텐츠 경로를 찾을 수 없습니다: ${PRIVATE_CONTENT_PATH}`);
      return;
    }
    
    // 관리 파일 확인 및 읽기
    const configFilePath = path.join(contentBasePath, PRIVATE_CONFIG_FILE);
    if (!fs.existsSync(configFilePath)) {
      handleError(`관리 파일을 찾을 수 없습니다: ${PRIVATE_CONFIG_FILE}`);
      return;
    }
    
    console.log('📄 관리 파일 읽는 중...');
    const configContent = fs.readFileSync(configFilePath, 'utf-8');
    let privatePages;
    
    try {
      privatePages = JSON.parse(configContent);
      if (!Array.isArray(privatePages)) {
        handleError('관리 파일은 배열 형식이어야 합니다.');
        return;
      }
    } catch (error) {
      handleError(`관리 파일 파싱 오류: ${error.message}`);
      return;
    }
    
    console.log(`📋 관리 파일에서 ${privatePages.length}개의 프라이빗 페이지 정보를 찾았습니다.`);
    
    // 만료되지 않은, 유효한 페이지만 필터링
    const validPages = privatePages.filter(page => {
      // 필수 속성 검사
      if (!page.externalPath || !page.sourcePath) {
        console.warn(`⚠️ 페이지 정보가 불완전합니다: ${JSON.stringify(page)}`);
        return false;
      }
      
      // 만료 여부 확인
      if (isExpired(page.expiryDate)) {
        console.log(`📅 페이지가 만료되었습니다: ${page.externalPath} (만료일: ${page.expiryDate})`);
        return false;
      }
      
      // 소스 파일 존재 확인
      const sourcePath = path.join(contentBasePath, page.sourcePath);
      if (!fs.existsSync(sourcePath)) {
        console.warn(`⚠️ 소스 파일이 존재하지 않습니다: ${page.sourcePath}`);
        return false;
      }
      
      return true;
    });
    
    console.log(`✅ ${validPages.length}개의 유효한 프라이빗 페이지가 처리됩니다.`);
    
    // 유효한 페이지를 지정된 경로로 복사
    for (const page of validPages) {
      const sourcePath = path.join(contentBasePath, page.sourcePath);
      const destPath = path.join(PRIVATE_PAGES_DIR, `${page.externalPath}.md`);
      
      console.log(`🔄 페이지 생성 중: ${page.externalPath} <- ${page.sourcePath}`);
      
      // 디렉토리 경로 확인 및 생성 (externalPath에 디렉토리 구조가 포함된 경우)
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        console.log(`📁 디렉토리 생성됨: ${destDir}`);
      }
      
      // 소스 파일 읽기
      const content = fs.readFileSync(sourcePath, 'utf-8');
      
      // 파일 저장
      fs.writeFileSync(destPath, content);
    }

    console.log('🎉 모든 프라이빗 페이지 처리 완료!');
  } catch (error) {
    handleError(`프로세스 실행 중 오류 발생: ${error.message}`);
  } finally {
    // 임시 디렉토리 정리
    cleanupTmpDir();
  }
}

// 메인 함수 실행 및 오류 발생 시에도 성공적으로 종료
main().then(() => {
  console.log('🏁 프라이빗 콘텐츠 가져오기 스크립트 완료');
  process.exit(0); // 항상 성공적으로 종료
}).catch((error) => {
  console.error('❌ 예상치 못한 오류 발생:', error.message);
  console.log('⚠️ 프라이빗 콘텐츠 가져오기를 건너뛰고 빌드를 계속 진행합니다.');
  process.exit(0); // 오류가 발생해도 성공적으로 종료
}); 