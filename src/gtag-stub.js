/**
 * gtag 플러그인 호출 전에 window.gtag가 존재하도록 스텁 정의
 * GA 스크립트 로드 전에 route 변경 시 발생하는 "gtag is not a function" 방지
 */
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }
}
