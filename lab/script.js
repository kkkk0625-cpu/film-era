// 存储原始主图的路径
let originalMainImage = '';

// 切换主图函数
function switchMainImage(clickedImage) {
  const mainImage = document.getElementById('main-hero-img');
  
  // 第一次点击时保存原始主图路径
  if (!originalMainImage) {
    originalMainImage = mainImage.src;
  }
  
  // 判断是否点击的是当前已显示的图片
  if (mainImage.src === clickedImage.src) {
    // 如果是，则恢复原始主图
    mainImage.src = originalMainImage;
    // 添加过渡动画
    mainImage.classList.add('image-transition');
    setTimeout(() => {
      mainImage.classList.remove('image-transition');
    }, 500);
  } else {
    // 否则，切换到点击的图片
    mainImage.src = clickedImage.getAttribute('data-src');
    // 添加过渡动画
    mainImage.classList.add('image-transition');
    setTimeout(() => {
      mainImage.classList.remove('image-transition');
    }, 500);
  }
}

window.onload = function() {
  setTimeout(function() {
    // 添加动画class
    document.querySelector('.loading-screen').classList.add('hide-animate');
    // 动画结束后隐藏
    setTimeout(function() {
      document.querySelector('.loading-screen').style.display = 'none';
      document.getElementById('main-content').style.display = '';
      
      // 启动数字跳动动画
      animateCounter();
      
      // 初始化历史时间轴
      var historySwiper = new Swiper('.history-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        speed: 800,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        on: {
          init: function() {
            updateTimelinePoints(this.activeIndex);
          },
          slideChange: function() {
            updateTimelinePoints(this.activeIndex);
          }
        }
      });

      // 更新时间点的激活状态
      function updateTimelinePoints(activeIndex) {
        document.querySelectorAll('.point').forEach(function(point, index) {
          if (index === activeIndex) {
            point.classList.add('active');
          } else {
            point.classList.remove('active');
          }
        });
      }

      // 点击时间点切换到对应的幻灯片
      document.querySelectorAll('.point').forEach(function(point, index) {
        point.addEventListener('click', function() {
          historySwiper.slideTo(index);
        });
      });
      
      if (typeof renderMessages === 'function') renderMessages();
    }, 700); // 动画时长与css一致
  }, 2500);
};

// 数字跳动动画
function animateCounter() {
  const countElement = document.querySelector('.main-hero-count-num');
  const finalValue = parseInt(countElement.textContent);
  const duration = 2000; // 动画持续2秒
  const frameRate = 30; // 每秒30帧
  const totalFrames = duration / 1000 * frameRate;
  const increment = finalValue / totalFrames;
  
  let currentValue = 0;
  let currentFrame = 0;
  
  const counter = setInterval(() => {
    currentFrame++;
    currentValue += increment;
    
    // 使用指数曲线让动画后期变慢
    const progress = currentFrame / totalFrames;
    const easedValue = finalValue * (1 - Math.pow(1 - progress, 3));
    
    countElement.textContent = Math.round(easedValue).toLocaleString();
    
    if (currentFrame >= totalFrames) {
      clearInterval(counter);
      countElement.textContent = finalValue.toLocaleString();
    }
  }, 1000 / frameRate);
}

// 简单留言板功能
function submitMessage() {
  const input = document.getElementById('message-input');
  const list = document.getElementById('message-list');
  const msg = input.value.trim();
  if (!msg) return;
  // 保存到本地存储
  let messages = JSON.parse(localStorage.getItem('messages') || '[]');
  messages.push(msg);
  localStorage.setItem('messages', JSON.stringify(messages));
  // 显示
  renderMessages();
  input.value = '';
}

function renderMessages() {
  const list = document.getElementById('message-list');
  let messages = JSON.parse(localStorage.getItem('messages') || '[]');
  list.innerHTML = '';
  messages.slice(-20).reverse().forEach(msg => {
    const li = document.createElement('li');
    li.textContent = msg;
    list.appendChild(li);
  });
}

// 返回顶部按钮功能
const backToTop = document.querySelector('.back-to-top');

// 监听滚动事件
window.addEventListener('scroll', () => {
  // 当页面滚动超过300px时显示按钮
  if (window.scrollY > 300) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

// 点击返回顶部
backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}); 

// 全屏遮罩功能
document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('fullscreenOverlay');
  const overlayImage = document.getElementById('overlayImage');
  const overlayText = document.getElementById('overlayText');
  const defaultText = "胶卷是一种缓慢而浪漫的记录方式，它不像数码那样即时，却在等待中赋予了每一帧画面更多的生命力。每一次快门的按下，都伴随着光线穿越镜头、化作影像的奇迹，在颗粒分明的底片中静静沉淀。那些光影的斑驳、颜色的偏移与模糊的边缘，不是缺陷，而是记忆真实存在的痕迹。胶卷里的世界有点旧、有点暖，就像日落时分的风，柔软而坚定。也许正因为无法预览，才让我们更珍惜每一次按下快门的时刻。";

  // 为每个拍立得照片添加点击事件
  document.querySelectorAll('.main-hero-polaroids img').forEach(img => {
    img.addEventListener('click', function() {
      // 获取图片路径，如果没有data-full属性，就使用src
      const imageSrc = this.getAttribute('data-full') || this.src;
      overlayImage.src = imageSrc;
      overlayText.textContent = defaultText;
      
      // 显示遮罩层
      overlay.style.display = 'flex';
      // 强制浏览器重绘
      void overlay.offsetWidth;
      // 添加显示类
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    });
  });

  // 监听滚轮事件，向下滚动关闭遮罩
  let startY = 0;
  
  window.addEventListener('wheel', function(e) {
    if (overlay.classList.contains('show') && e.deltaY > 30) {
      closeOverlay();
    }
  });
  
  // 移动设备触摸支持
  overlay.addEventListener('touchstart', function(e) {
    startY = e.touches[0].clientY;
  });
  
  overlay.addEventListener('touchmove', function(e) {
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY < -30) { // 向上滑动30px以上
      closeOverlay();
    }
  });
  
  // 点击遮罩层也可以关闭
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeOverlay();
    }
  });
  
  // 关闭遮罩层函数
  function closeOverlay() {
    // 移除显示类触发动画
    overlay.classList.remove('show');
    
    // 等待动画完成后隐藏元素
    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.style.overflow = ''; // 恢复背景滚动
    }, 500); // 与CSS过渡时间一致
  }
});

// 活动区导航点击切换
document.addEventListener('DOMContentLoaded', function() {
  const navImages = document.querySelectorAll('.activity-numbers .nav-image');
  const activitySlides = document.querySelectorAll('.activity-slide');
  
  // 确保初始状态正确
  updateActivityState(0);
  
  navImages.forEach(navImage => {
    navImage.addEventListener('click', function() {
      // 获取要显示的幻灯片索引
      const slideIndex = parseInt(this.getAttribute('data-index'));
      updateActivityState(slideIndex);
      
      // 添加点击反馈效果
      this.classList.add('clicked');
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 300);
    });
  });
  
  function updateActivityState(activeIndex) {
    // 移除所有活动状态
    navImages.forEach(img => img.classList.remove('active'));
    activitySlides.forEach(slide => slide.classList.remove('active'));

    // 为当前索引的导航和幻灯片添加活动状态
    navImages[activeIndex].classList.add('active');
    activitySlides[activeIndex].classList.add('active');
  }
});

// ==================== 滑轮控制组件功能 ====================
document.addEventListener('DOMContentLoaded', function() {
  const sliderLabels = document.querySelectorAll('.slider-label');
  const sliderLabelsContainer = document.querySelector('.slider-labels');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const sliderTrack = document.querySelector('.slider-track');
  const overlayImage = document.querySelector('.overlay-image');

  let currentIndex = 0; // 默认显示 0
  const labelWidth = 60; // 每个标签的宽度（包含padding）
  const visibleLabels = 5; // 可见标签数量

  // 初始化显示
  updateSliderPosition(currentIndex);

  // 更新图片色调 - 负数冷色调，正数暖色调
  function updateImageHue(index) {
    if (!overlayImage) return;

    // index 范围 -5 到 5
    // 负数：冷色调（蓝色） hue-rotate 向蓝色偏移
    // 正数：暖色调（橙色/红色） hue-rotate 向橙色偏移
    // 0：正常色调

    const hueRotate = index * 30; // 每个单位30度色相偏移
    const saturate = 1 + Math.abs(index) * 0.2; // 增加饱和度

    if (index < 0) {
      // 冷色调：蓝色
      overlayImage.style.filter = `hue-rotate(${hueRotate}deg) saturate(${saturate})`;
    } else if (index > 0) {
      // 暖色调：橙色/红色
      overlayImage.style.filter = `hue-rotate(${hueRotate}deg) saturate(${saturate})`;
    } else {
      // 正常色调
      overlayImage.style.filter = 'none';
    }
  }

  // 更新滑轮位置 - 移动标签使当前标签居中
  function updateSliderPosition(index) {
    // 更新标签高亮
    sliderLabels.forEach((label) => {
      const labelIndex = parseInt(label.dataset.index);
      label.classList.toggle('active', labelIndex === index);
    });

    // 计算需要移动的距离，使当前标签居中
    const wrapperWidth = sliderTrack.querySelector('.slider-labels-wrapper').offsetWidth;
    const centerOffset = wrapperWidth / 2;
    const labelOffset = (index + 5) * labelWidth; // +5 因为索引从-5开始
    const translateX = centerOffset - labelOffset - labelWidth / 2;

    // 移动标签容器
    sliderLabelsContainer.style.transform = `translateX(${translateX}px)`;

    // 更新图片色调
    updateImageHue(index);

    currentIndex = index;
  }

  // 上一个按钮
  prevBtn.addEventListener('click', function() {
    updateSliderPosition(currentIndex - 1);
  });

  // 下一个按钮
  nextBtn.addEventListener('click', function() {
    updateSliderPosition(currentIndex + 1);
  });

  // 点击标签切换
  sliderLabels.forEach((label) => {
    label.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      updateSliderPosition(index);
    });
  });

  // 滑轮拖动功能 - 拖动标签列表
  let isDragging = false;
  let startX = 0;
  let currentTranslateX = 0;

  function handleDragStart(clientX) {
    isDragging = true;
    startX = clientX;
    const transform = sliderLabelsContainer.style.transform;
    currentTranslateX = transform ? parseFloat(transform.match(/-?\d+\.?\d*/)?.[0] || 0) : 0;
    sliderLabelsContainer.style.transition = 'none';
  }

  function handleDragMove(clientX) {
    if (!isDragging) return;

    const deltaX = clientX - startX;
    const newTranslateX = currentTranslateX + deltaX;

    // 实时更新标签位置
    sliderLabelsContainer.style.transform = `translateX(${newTranslateX}px)`;

    // 计算当前中心位置的标签索引
    const wrapperWidth = sliderTrack.querySelector('.slider-labels-wrapper').offsetWidth;
    const centerOffset = wrapperWidth / 2;
    const labelOffset = centerOffset - newTranslateX - labelWidth / 2;
    const newIndex = Math.round(labelOffset / labelWidth) - 5; // -5 因为索引从-5开始

    // 更新高亮
    if (newIndex !== currentIndex && newIndex >= -5 && newIndex <= 5) {
      sliderLabels.forEach((label) => {
        const labelIndex = parseInt(label.dataset.index);
        label.classList.toggle('active', labelIndex === newIndex);
      });
      // 实时更新图片色调
      updateImageHue(newIndex);
    }
  }

  function handleDragEnd(clientX) {
    if (!isDragging) return;
    isDragging = false;
    sliderLabelsContainer.style.transition = 'transform 0.3s ease';

    const deltaX = clientX - startX;
    const newTranslateX = currentTranslateX + deltaX;

    // 计算应该吸附到的标签索引
    const wrapperWidth = sliderTrack.querySelector('.slider-labels-wrapper').offsetWidth;
    const centerOffset = wrapperWidth / 2;
    const labelOffset = centerOffset - newTranslateX - labelWidth / 2;
    let newIndex = Math.round(labelOffset / labelWidth) - 5;

    // 限制范围
    newIndex = Math.max(-5, Math.min(5, newIndex));

    updateSliderPosition(newIndex);
  }

  // 鼠标事件
  sliderTrack.addEventListener('mousedown', function(e) {
    handleDragStart(e.clientX);
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    handleDragMove(e.clientX);
  });

  document.addEventListener('mouseup', function(e) {
    handleDragEnd(e.clientX);
  });

  // 触摸事件（移动端）
  sliderTrack.addEventListener('touchstart', function(e) {
    handleDragStart(e.touches[0].clientX);
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', function(e) {
    handleDragMove(e.touches[0].clientX);
  }, { passive: false });

  document.addEventListener('touchend', function(e) {
    handleDragEnd(e.changedTouches[0].clientX);
  });
});