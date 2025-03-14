#!/usr/bin/env node

/**
 * 이 스크립트는 만료된 콘텐츠가 있는지 확인합니다.
 * 만료된 콘텐츠가 있으면 빌드를 트리거합니다.
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

// 날짜가 만료되었는지 확인하는 함수
function isExpired(expiryDateStr) {
  if (!expiryDateStr) return false; // 만료일이 없으면 만료되지 않음
  
  const expiryDate = new Date(expiryDateStr);
  const currentDate = new Date();
  
  return currentDate > expiryDate;
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

// GitHub Actions 출력 설정 함수
function setOutput(name, value) {
  const output = `${name}=${value}`;
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${output}\n`);
  }
  console.log(`출력 설정: ${output}`);
}

// 스크립트 시작
console.log('🚀 만료된 콘텐츠 확인 시작');

// 환경 변수 확인
if (!PRIVATE_REPO_URL || !PRIVATE_REPO_TOKEN) {
  console.log('필수 환경 변수가 설정되지 않았습니다.');
  setOutput('needs_rebuild', 'false');
  process.exit(0);
}

try {
  // 임시 디렉토리 생성
  cleanupTmpDir();
  fs.mkdirSync(TMP_DIR, { recursive: true });
  
  // 프라이빗 레포 클론
  const authRepoUrl = PRIVATE_REPO_URL.replace(
    'https://',
    `https://${PRIVATE_REPO_TOKEN}@`
  );
  
  console.log('📥 프라이빗 레포 클론 중...');
  execSync(`git clone --depth 1 ${authRepoUrl} ${TMP_DIR}`, { stdio: 'pipe' });
  
  // 콘텐츠 경로 확인
  const contentBasePath = path.join(TMP_DIR, PRIVATE_CONTENT_PATH);
  if (!fs.existsSync(contentBasePath)) {
    console.log(`프라이빗 콘텐츠 경로를 찾을 수 없습니다: ${PRIVATE_CONTENT_PATH}`);
    setOutput('needs_rebuild', 'false');
    process.exit(0);
  }
  
  // 관리 파일 확인 및 읽기
  const configFilePath = path.join(contentBasePath, PRIVATE_CONFIG_FILE);
  if (!fs.existsSync(configFilePath)) {
    console.log(`관리 파일을 찾을 수 없습니다: ${PRIVATE_CONFIG_FILE}`);
    setOutput('needs_rebuild', 'false');
    process.exit(0);
  }
  
  console.log('📄 관리 파일 읽는 중...');
  const configContent = fs.readFileSync(configFilePath, 'utf-8');
  
  let privatePages;
  try {
    privatePages = JSON.parse(configContent);
    if (!Array.isArray(privatePages)) {
      throw new Error('관리 파일은 배열 형식이어야 합니다.');
    }
  } catch (error) {
    console.log(`관리 파일 파싱 오류: ${error.message}`);
    setOutput('needs_rebuild', 'false');
    process.exit(0);
  }
  
  // 만료된 페이지가 있는지 확인
  const expiredPages = privatePages.filter(page => isExpired(page.expiryDate));
  
  if (expiredPages.length > 0) {
    console.log(`🔄 ${expiredPages.length}개의 만료된 페이지가 있습니다.`);
    
    // 만료된 페이지 정보 출력
    expiredPages.forEach(page => {
      console.log(`- ${page.externalPath} (만료일: ${page.expiryDate})`);
    });
    
    // 재빌드가 필요함을 알림
    setOutput('needs_rebuild', 'true');
  } else {
    console.log('💤 만료된 페이지가 없습니다.');
    setOutput('needs_rebuild', 'false');
  }
  
} catch (error) {
  console.error(`❌ 오류 발생: ${error.message}`);
  setOutput('needs_rebuild', 'false');
} finally {
  // 임시 디렉토리 정리
  cleanupTmpDir();
}