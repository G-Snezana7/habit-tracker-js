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

// Отрисовка списка привычек
const renderList = () => {
  listHabit.innerHTML = ''; 
  const todayStr = getTodayDateString(); 

  arrHabit.forEach((item) => {
    // Создаем строку списка
    const li = document.createElement('li');
    li.classList.add('habit-item'); 
    
    // Создаем текст
    const textSpan = document.createElement('span');
    textSpan.textContent = item.text;
    textSpan.classList.add('habit-item__text');
    
    // Создаем контейнер для кнопок управления (чтобы они стояли рядышком справа)
    const controlsDiv = document.createElement('div');
    controlsDiv.classList.add('habit-item__controls'); // Добавим этот класс во флекс в CSS
    
    // Создаем кнопку-счетчик
    const counterBtn = document.createElement('button');
    counterBtn.classList.add('counter-btn');

    // Проверка блокировки клика по дате
    if (item.lastClickDate === todayStr) {
      counterBtn.disabled = true;
      counterBtn.classList.add('disabled');
      counterBtn.textContent = `✓ ${item.count}`; 
    } else {
      counterBtn.textContent = item.count; 
    }
    
    // Слушатель клика по счетчику
    counterBtn.addEventListener('click', () => {
      if (item.lastClickDate === todayStr) return;
      item.count++; 
      item.lastClickDate = todayStr; 
      saveToLocalStorage(); 
      renderList(); 
    });

    // Создаем кнопку удаления (крестик)
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.classList.add('delete-btn'); // Новый класс для стилизации в CSS
    
    // Слушатель клика для удаления (Иммутабельный подход через .filter())
    deleteBtn.addEventListener('click', () => {
      // Оставляем в массиве только те элементы, у которых ID НЕ СОВПАДАЕТ с текущим
      arrHabit = arrHabit.filter(habit => habit.id !== item.id);
      saveToLocalStorage(); // Обновляем память
      renderList(); // Перерисовываем экран
    });

    // Собираем элементы управления вместе
    controlsDiv.append(counterBtn, deleteBtn);
    
    // Собираем всю карточку целиком
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
