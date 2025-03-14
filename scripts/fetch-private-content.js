#!/usr/bin/env node

/**
 * 이 스크립트는 프라이빗 레포에서 콘텐츠를 가져와서 resume.md 파일과 병합하는 역할을 합니다.
 * 필요한 환경 변수:
 * - PRIVATE_REPO_URL: 프라이빗 레포 URL (예: https://github.com/username/private-repo.git)
 * - PRIVATE_REPO_TOKEN: 프라이빗 레포에 접근하기 위한 개인 액세스 토큰
 * - PRIVATE_CONTENT_PATH: 프라이빗 레포 내의 콘텐츠 경로
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 환경 변수 로드
require('dotenv').config();

const PRIVATE_REPO_URL = process.env.PRIVATE_REPO_URL;
const PRIVATE_REPO_TOKEN = process.env.PRIVATE_REPO_TOKEN;
const PRIVATE_CONTENT_PATH = process.env.PRIVATE_CONTENT_PATH || 'contents';
const TMP_DIR = path.join(__dirname, '../.tmp-private-repo');
const PRIVATE_DIR = path.join(__dirname, '../');

// 에러 처리 함수
function handleError(message) {
  console.error(`❌ 오류: ${message}`);
  process.exit(1);
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

// 파일 또는 디렉토리 복사 함수
function copyRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  if (fs.statSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    for (const file of files) {
      const srcFile = path.join(source, file);
      const destFile = path.join(target, file);
      
      if (fs.statSync(srcFile).isDirectory()) {
        copyRecursive(srcFile, destFile);
      } else {
        fs.copyFileSync(srcFile, destFile);
        console.log(`📄 파일 복사됨: ${destFile}`);
      }
    }
  } else {
    const fileName = path.basename(source);
    fs.copyFileSync(source, path.join(target, fileName));
    console.log(`📄 파일 복사됨: ${path.join(target, fileName)}`);
  }
}

// 스크립트 시작
console.log('🚀 프라이빗 레포에서 콘텐츠 가져오기 시작');

// 환경 변수 확인
if (!PRIVATE_REPO_URL) {
  handleError('PRIVATE_REPO_URL 환경 변수가 설정되지 않았습니다.');
}

if (!PRIVATE_REPO_TOKEN) {
  handleError('PRIVATE_REPO_TOKEN 환경 변수가 설정되지 않았습니다.');
}

// 임시 디렉토리 생성 및 기존 디렉토리 정리
cleanupTmpDir();
fs.mkdirSync(TMP_DIR, { recursive: true });

// private 디렉토리 생성
if (!fs.existsSync(PRIVATE_DIR)) {
  fs.mkdirSync(PRIVATE_DIR, { recursive: true });
  console.log('📁 private 디렉토리 생성됨');
} else {
  console.log('📁 private 디렉토리가 이미 존재함');
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
  const privateContentPath = path.join(TMP_DIR, PRIVATE_CONTENT_PATH);
  if (!fs.existsSync(privateContentPath)) {
    handleError(`프라이빗 콘텐츠 경로를 찾을 수 없습니다: ${PRIVATE_CONTENT_PATH}`);
  }
  
  // 프라이빗 콘텐츠를 private 디렉토리로 복사
  console.log('🔄 프라이빗 콘텐츠를 private 디렉토리로 복사 중...');
  copyRecursive(privateContentPath, PRIVATE_DIR);
  
  console.log('✅ 가져오기 완료!');
} catch (error) {
  handleError(`프로세스 실행 중 오류 발생: ${error.message}`);
} finally {
  // 임시 디렉토리 정리
  cleanupTmpDir();
} 