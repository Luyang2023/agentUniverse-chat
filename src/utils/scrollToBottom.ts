export const smoothScrollToBottom = (element: HTMLDivElement, millisecond: number) => {
    const duration = millisecond; // 动画持续时间
    const start = element.scrollTop; // 起始滚动位置
    
    const end = element.scrollHeight - element.clientHeight; // 目标滚动位置
    
    const startTime = performance.now(); // 动画开始时间

    const easeInOutQuad = (t: number) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime; // 经过的时间
      const progress = Math.min(elapsedTime / duration, 1); // 进度百分比
      const scrollTo = start + (end - start) * easeInOutQuad(progress); // 当前滚动位置

      element.scrollTop = scrollTo;

      if (elapsedTime < duration) {
        // 继续执行动画
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };
  