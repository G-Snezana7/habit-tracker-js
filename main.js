const addButton = document.getElementById('add-button-js');
const inputTracker = document.getElementById('input-js');
const listHabit = document.getElementById('list-js');

// 1. Инициализируем массив данными из хранилища
const savedData = localStorage.getItem('myAppList');
let arrHabit = savedData ? JSON.parse(savedData) : [];

// Функция сохранения в localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('myAppList', JSON.stringify(arrHabit));
};

// Вспомогательная функция, которая возвращает сегодняшнюю дату в формате YYYY-MM-DD
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Функция живой валидации кнопки «Добавить»
const validateInput = () => {
  // Если в инпуте пусто (или только пробелы), блокируем кнопку добавления
  if (inputTracker.value.trim() === '') {
    addButton.disabled = true;
    addButton.classList.add('disabled'); // Можно добавить стиль блеклости в CSS
  } else {
    addButton.disabled = false;
    addButton.classList.remove('disabled');
  }
};

// Отрисовка списка привычек с поддержкой доступности (a11y)
const renderList = () => {
  listHabit.innerHTML = ''; 
  const todayStr = getTodayDateString(); 

  arrHabit.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('habit-item'); 
    
    const textSpan = document.createElement('span');
    textSpan.textContent = item.text;
    textSpan.classList.add('habit-item__text');
    
    const controlsDiv = document.createElement('div');
    controlsDiv.classList.add('habit-item__controls'); 
    
    const counterBtn = document.createElement('button');
    counterBtn.classList.add('counter-btn');
    
    // ДОСТУПНОСТЬ: Добавляем понятное описание для кнопки-счетчика
    counterBtn.setAttribute('aria-label', `Отметить прогресс по привычке. Текущий счет: ${item.count}`);

    if (item.lastClickDate === todayStr) {
      counterBtn.disabled = true;
      counterBtn.classList.add('disabled');
      counterBtn.textContent = `✓ ${item.count}`; 
      counterBtn.setAttribute('aria-label', `Привычка уже отмечена сегодня. Всего выполнено раз: ${item.count}`);
    } else {
      counterBtn.textContent = item.count; 
    }
    
    counterBtn.addEventListener('click', () => {
      if (item.lastClickDate === todayStr) return;
      item.count++; 
      item.lastClickDate = todayStr; 
      saveToLocalStorage(); 
      renderList(); 
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.classList.add('delete-btn');
    
    // ДОСТУПНОСТЬ: Обозначаем для скринридеров, что делает кнопка-крестик
    deleteBtn.setAttribute('aria-label', `Удалить привычку: "${item.text}"`);
    
    deleteBtn.addEventListener('click', () => {
      arrHabit = arrHabit.filter(habit => habit.id !== item.id);
      saveToLocalStorage(); 
      renderList(); 
    });

    controlsDiv.append(counterBtn, deleteBtn);
    li.append(textSpan, controlsDiv);
    listHabit.append(li);
  });
};


// Функция добавления новой привычки
const saveValue = () => {
  const value = inputTracker.value.trim();
  if (value === '') return;

  const newItem = {
    id: Date.now(),
    text: value,
    count: 0,
    lastClickDate: null
  };

  arrHabit = [...arrHabit, newItem]; 
  saveToLocalStorage(); 
  inputTracker.value = ''; 
  
  validateInput(); // Проверяем инпут после очистки (заблокирует кнопку заново)
  renderList();
};

// СЛУШАТЕЛИ СОБЫТИЙ

// Клик по кнопке «Добавить»
addButton.addEventListener('click', saveValue);

// Слушаем ввод текста в инпут на лету для блокировки/разблокировки кнопки
inputTracker.addEventListener('input', validateInput);

// Нажатие клавиши Enter внутри инпута
inputTracker.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    saveValue();
  }
});

// СТАРТ ПРИЛОЖЕНИЯ
validateInput(); // Блокируем кнопку «Добавить» при первой загрузке, так как инпут пустой
renderList();    // Показываем сохраненные привычки
