#!/usr/bin/env node

/**
 * 이 스크립트는 만료 날짜가 24시간 이내인 콘텐츠가 있는지 확인합니다.
 * 만료 예정 콘텐츠가 있으면 GitHub Actions 출력 변수를 설정합니다.
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

// 날짜가 24시간 이내에 만료되는지 확인하는 함수
function isExpiringWithin24Hours(expiryDateStr) {
  if (!expiryDateStr) return false;
  
  const expiryDate = new Date(expiryDateStr);
  const currentDate = new Date();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  
  // 이미 만료된 경우는 false 반환
  if (currentDate > expiryDate) return false;
  
  // 24시간 이내에 만료되는 경우 true 반환
  return (expiryDate - currentDate) <= oneDayInMs;
}

// 임시 디렉토리 정리
function cleanupTmpDir() {
  if (fs.existsSync(TMP_DIR)) {
    try {
      execSync(`rm -rf ${TMP_DIR}`);
    } catch (err) {
      console.warn(`⚠️ 임시 디렉토리 정리 실패: ${err.message}`);
    }
  }
}

// 메인 로직
try {
  // 임시 디렉토리 생성
  fs.mkdirSync(TMP_DIR, { recursive: true });
  
  // 프라이빗 레포 클론
  const authRepoUrl = PRIVATE_REPO_URL.replace(
    'https://',
    `https://${PRIVATE_REPO_TOKEN}@`
  );
  execSync(`git clone --depth 1 ${authRepoUrl} ${TMP_DIR}`, { stdio: 'pipe' });
  
  // 관리 파일 확인 및 읽기
  const configFilePath = path.join(TMP_DIR, PRIVATE_CONTENT_PATH, PRIVATE_CONFIG_FILE);
  if (!fs.existsSync(configFilePath)) {
    console.log('관리 파일을 찾을 수 없습니다.');
    console.log('::set-output name=has_expiring_content::false');
    process.exit(0);
  }
  
  const configContent = fs.readFileSync(configFilePath, 'utf-8');
  let privatePages;
  
  try {
    privatePages = JSON.parse(configContent);
  } catch (error) {
    console.log(`관리 파일 파싱 오류: ${error.message}`);
    console.log('::set-output name=has_expiring_content::false');
    process.exit(0);
  }
  
  // 24시간 이내에 만료되는 페이지 확인
  const expiringPages = privatePages.filter(page => isExpiringWithin24Hours(page.expiryDate));
  
  if (expiringPages.length > 0) {
    console.log(`${expiringPages.length}개의 페이지가 24시간 이내에 만료됩니다.`);
    // GitHub Actions 출력 변수 설정
    console.log(`has_expiring_content=true >> $GITHUB_OUTPUT`);
  } else {
    console.log('24시간 이내에 만료되는 페이지가 없습니다.');
    console.log('::set-output name=has_expiring_content::false');
  }
  
} catch (error) {
  console.error(`오류 발생: ${error.message}`);
  console.log('::set-output name=has_expiring_content::false');
} finally {
  // 임시 디렉토리 정리
  cleanupTmpDir();
}