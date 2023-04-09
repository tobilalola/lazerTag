const html = document.documentElement
const body = document.body
const pageWrapper = document.querySelector('.page')
const header = document.querySelector('.header')
const firstScreen = document.querySelector('[data-observ]')
const burgerButton = document.querySelector('.icon-menu')
const menu = document.querySelector('.menu')
const lockPaddingElements = document.querySelectorAll('[data-lp]')

const toggleBodyLock = (isLock) => {
  FLS(`Попап ${isLock ? 'открыт' : 'закрыт'}`)
  const lockPaddingValue = window.innerWidth - pageWrapper.offsetWidth

  setTimeout(() => {
    if (lockPaddingElements) {
      lockPaddingElements.forEach((element) => {
        element.style.paddingRight = isLock ? `${lockPaddingValue}px` : '0px'
      })
    }
  
    body.style.paddingRight = isLock ? `${lockPaddingValue}px` : '0px'
    body.classList.toggle('lock', isLock)
  }, isLock ? 0 : 500)
}

// Универсальная функция для открытия и закрытия попапо =================================================================================================================
const togglePopupWindows = () => {
  document.addEventListener('click', ({ target }) => {
    if (target.closest('[data-type]')) {
      const popup = document.querySelector(
        `[data-popup="${target.dataset.type}"]`
      )

      if (document.querySelector('._is-open')) {
        document.querySelectorAll('._is-open').forEach((modal) => {
          modal.classList.remove('_is-open')
        })
      }

      popup.classList.add('_is-open')
      toggleBodyLock(true)
    }

    if (
      target.classList.contains('_overlay-bg') ||
      target.closest('.button-close')
    ) {
      const popup = target.closest('._overlay-bg')

      popup.classList.remove('_is-open')
      toggleBodyLock(false)
    }
  })
}


$('a[href^="#"]').on("click", function(e){
  let anchor = $(this);
  $('html, body').stop().animate({
    scrollTop: $(anchor.attr("href")).offset().top
  }, 1000);
  e.preventDefault();
});

document.addEventListener('DOMContentLoaded', function(){
  let days = document.querySelectorAll('.days'),
      hours = document.querySelectorAll('.hours'),
      minutes = document.querySelectorAll('.minutes'),
      seconds = document.querySelectorAll('.seconds')

  start_diff_timer(days, hours, minutes, seconds, 2100, 0, 'timer')

  if(document.querySelector('.description')) {
    $('.slider__imgBorder').slick({
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: '.slider__arrowLeftBx',
      nextArrow: '.slider__arrowBx',
      adaptiveHeight: true,
      autoplay: true,
      autoplaySpeed: 4000
    });
    $('.birthday-slider').slick({
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: '.birthday__arrowLeftBx',
      nextArrow: '.birthday__arrowBx',
      adaptiveHeight: true,
      autoplay: true,
      autoplaySpeed: 4000
    });

  }
});



/* Раскомментировать для использования */
togglePopupWindows()
// =======================================================================================================


let start_diff_timer = ($days = null, $hours = null, $minutes = null, $seconds = null, difference = 5, last_seconds = 59, local_host_name, $days_text = null, $hours_text = null, $minutes_text = null, $seconds_text = null) => {
  // конечная дата, например 1 июля 2021
  let deadline;
  let timerId = null;
  let interval_5_seconds = null;

  if((new Date().getDate() > new Date(localStorage.getItem(local_host_name)).getDate()) || new Date().getMonth() > new Date(localStorage.getItem(local_host_name)).getMonth() ){
    clearInterval(interval_5_seconds)
    interval_5_seconds = null
    localStorage.removeItem(local_host_name)
  }
  if(localStorage.getItem(local_host_name)){
    deadline = new Date(localStorage.getItem(local_host_name))
  }else{
    deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + difference)
    if(deadline.getMinutes() > 59){
      deadline.setMinutes(deadline.getMinutes() - 59)
    }
    localStorage.setItem(local_host_name, deadline)
  }
  // склонение числительных
  function declensionNum(num, words) {
    return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
  }
  function initializeClock(){
    if(!$seconds) return false
    let second = last_seconds
    if(!interval_5_seconds){
      interval_5_seconds = setInterval(() => {
        if(second < 0) second = last_seconds
        $seconds.forEach(el => {
          el.textContent = second < 10 ? '0' + second : second
        })
        second -= 1
      }, 1000)
    }
  }
  // вычисляем разницу дат и устанавливаем оставшееся времени в качестве содержимого элементов
  function countdownTimer() {
    const diff = deadline - new Date();
    if (diff <= 0) {
      clearInterval(timerId);
      initializeClock()
    }
    const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0
    const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0
    const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0
    const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0

    if($days) $days.forEach(el => {el.textContent = days < 10 ? '0' + days : days})
    if($hours) $hours.forEach(el => {el.textContent = hours < 10 ? '0' + hours : hours})
    if($minutes) $minutes.forEach(el => {el.textContent = minutes < 10 ? '0' + minutes : minutes})
    if($seconds) $seconds.forEach(el => {el.textContent = seconds < 10 ? '0' + seconds : seconds})

    if($days_text) $days_text.textContent = declensionNum(days, ['день', 'дня', 'дней'])
    if($hours_text) $hours_text.textContent = declensionNum(days, ['час', 'часа', 'часов'])
    if($minutes_text) $minutes_text.textContent = declensionNum(days, ['минута', 'минуты', 'минут'])
    if($seconds_text) $seconds_text.textContent = declensionNum(days, ['секунда', 'секунды', 'секунд'])
  }
  // вызываем функцию countdownTimer
  countdownTimer();
  // вызываем функцию countdownTimer каждую секунду
  timerId = setInterval(countdownTimer, 1000);
}