import axios from 'axios';
import { useState, useEffect } from 'react';
import delIcon from '../../images/delete.svg';
import delDone from '../../images/deleteDone.svg';

import './DayList.css';

export default function DayList() {
  const url = 'http://localhost:3001/todos/';
  const date = new Date();
  const days = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ];

  const [todo, setTodo] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    axios.get(url).then((response) => {
      setTodo(
        response.data
          .filter((item) => {
            return filter === 'all' ? true : filter === item.status;
          })
          .map((item) => {
            return (
              <li
                className={`DayList__listItem DayList__listItem_${item.status}`}
                key={item.id}
              >
                <input
                  type='text'
                  placeholder={item.title}
                  onKeyDown={(event) => {
                    if (event.code === 'Enter') {
                      event.target.blur();
                    }
                  }}
                  onBlur={(event) => {
                    if (
                      event.target.value.length &&
                      event.target.value !== item.title
                    ) {
                      axios
                        .put(`${url}${item.id}`, {
                          id: item.id,
                          title: event.target.value,
                          status: item.status,
                        })
                        .then(setIsDataChanged(!isDataChanged));
                    }
                    event.target.value = '';
                  }}
                />
                <div className='DayList__itemButtons'>
                  <svg
                    className='DayList__done'
                    onClick={(event) => {
                      axios
                        .put(`${url}${item.id}`, {
                          id: item.id,
                          title: item.title,
                          status: item.status === 'todo' ? 'done' : 'todo',
                        })
                        .then(setIsDataChanged(!isDataChanged));
                    }}
                    width='20'
                    height='20'
                    viewBox='0 0 200 200'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200ZM157.36 63.975C159.555 60.4625 158.488 55.8353 154.975 53.64C151.462 51.4447 146.835 52.5125 144.64 56.025L94.5335 136.195L51.194 94.5896C48.2059 91.721 43.4582 91.8179 40.5896 94.806C37.721 97.7941 37.8179 102.542 40.806 105.41L90.806 153.41C92.4355 154.975 94.6831 155.721 96.9247 155.443C99.1662 155.164 101.163 153.89 102.36 151.975L157.36 63.975Z'
                      fill='url(#paint0_linear_201_4)'
                    />
                    <defs>
                      <linearGradient
                        id='paint0_linear_201_4'
                        x1='234'
                        y1='-16'
                        x2='24'
                        y2='182'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop stopColor='#FF0000' />
                        <stop offset='1' stopColor='#7729F7' />
                        <stop offset='1' stopColor='#6100FF' />
                      </linearGradient>
                    </defs>
                  </svg>
                  <img
                    className='DayList__delete'
                    src={delIcon}
                    onClick={(event) => {
                      axios
                        .delete(`${url}${item.id}`)
                        .then(setIsDataChanged(!isDataChanged));
                    }}
                    alt='Удалить'
                    width='19px'
                    height='20px'
                  />
                </div>
              </li>
            );
          })
      );
    });
  }, [setTodo, setIsDataChanged, isDataChanged, filter]);

  return (
    <div className='DayList'>
      <div className='DayList__header'>
        <p className='DayList__date'>{date.toLocaleString().substring(0, 5)}</p>
        <p className='DayList__weekday'>{days[date.getDay()]}</p>
      </div>
      <ul className='DayList__list'>
        {todo}
        <li className='DayList__listItem DayList__listItem_blank'>
          <input
            type='text'
            placeholder='Новая задача'
            onKeyDown={(event) => {
              if (event.code === 'Enter') {
                event.target.blur();
              }
            }}
            onBlur={(event) => {
              if (event.target.value.length) {
                axios
                  .post(url, {
                    id: date.getTime(),
                    title: event.target.value,
                    status: 'todo',
                  })
                  .then(() => {
                    setIsDataChanged(!isDataChanged);
                    event.target.value = '';
                  });
              }
            }}
          />
        </li>
      </ul>
      <div className='DayList__footer'>
        <div className='DayList__filterButtons'>
          <div className='DayList__filterRadio'>
            <input
              id='all'
              type='radio'
              name='radio'
              value='all'
              checked={filter === 'all'}
              onChange={(event) => {
                setFilter(event.target.value);
              }}
            />
            <label htmlFor='all'>Все</label>
          </div>

          <div className='DayList__filterRadio'>
            <input
              id='todo'
              type='radio'
              name='radio'
              value='todo'
              checked={filter === 'todo'}
              onChange={(event) => {
                setFilter(event.target.value);
              }}
            />
            <label htmlFor='todo'>Активные</label>
          </div>

          <div className='DayList__filterRadio'>
            <input
              id='done'
              type='radio'
              name='radio'
              value='done'
              checked={filter === 'done'}
              onChange={(event) => {
                setFilter(event.target.value);
              }}
            />
            <label htmlFor='done'>Завершённые</label>
          </div>
        </div>
        <img
          className='DayList__deleteDone'
          src={delDone}
          width='20px'
          height='20px'
          alt='Удалить все завершённые'
          title='Удалить все завершённые дела'
          onClick={(event) => {
            axios
              .get(url)
              .then((response) => {
                response.data
                  .filter((item) => item.status === 'done')
                  .forEach((element) => {
                    axios.delete(`${url}${element.id}`);
                  });
              })
              .then(setIsDataChanged(!isDataChanged));
          }}
        />
      </div>
    </div>
  );
}
