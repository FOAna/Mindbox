import axios from 'axios';
import { useMemo } from 'react';
import { useCallback } from 'react';
import { useState, useEffect } from 'react';
import DoneIcon from '../../icons/DoneIcon';
import delIcon from '../../images/delete.svg';
import delDone from '../../images/deleteDone.svg';

import './DayList.css';

export const TaskStatus = { TODO: 'todo', DONE: 'done' };

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

  const onBlurChange = useCallback(
    (event, item) => {
      if (event.target.value.length && event.target.value !== item.title) {
        axios
          .put(`${url}${item.id}`, {
            id: item.id,
            title: event.target.value,
            status: item.status,
          })
          .then(setIsDataChanged(!isDataChanged));
      }
      event.target.value = '';
    },
    [isDataChanged]
  );

  const onClickDone = useCallback(
    (item) => {
      axios
        .put(`${url}${item.id}`, {
          id: item.id,
          title: item.title,
          status:
            item.status === TaskStatus.TODO ? TaskStatus.DONE : TaskStatus.TODO,
        })
        .then(setIsDataChanged(!isDataChanged));
    },
    [isDataChanged]
  );

  const onClickDelete = useCallback(
    (item) => {
      axios.delete(`${url}${item.id}`).then(setIsDataChanged(!isDataChanged));
    },
    [isDataChanged]
  );

  const getTodosFromResponse = useMemo(() => {
    return todo.map((item) => {
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
            onBlur={(event) => onBlurChange(event, item)}
          />
          <div className='DayList__itemButtons'>
            <div
              className='DayList__iconWrapper'
              onClick={() => onClickDone(item)}
            >
              <DoneIcon className='DayList__done' status={item.status} />
            </div>
            <img
              className='DayList__delete'
              src={delIcon}
              onClick={() => onClickDelete(item)}
              alt='Удалить'
              width='19px'
              height='20px'
            />
          </div>
        </li>
      );
    });
  }, [todo, onBlurChange, onClickDone, onClickDelete]);

  useEffect(() => {
    axios.get(url).then((response) => {
      setTodo(
        response.data.filter((item) => {
          return filter === 'all' ? true : filter === item.status;
        })
      );
    });
  }, [setTodo, filter, isDataChanged]);

  return (
    <div className='DayList'>
      <div className='DayList__header'>
        <p className='DayList__date'>{date.toLocaleString().substring(0, 5)}</p>
        <p className='DayList__weekday'>{days[date.getDay()]}</p>
      </div>
      <ul className='DayList__list'>
        {getTodosFromResponse}
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
          onClick={() => {
            axios.get(url).then((response) => {
              response.data
                .filter((item) => item.status === 'done')
                .forEach((element) => {
                  axios.delete(`${url}${element.id}`);
                });
              setIsDataChanged(!isDataChanged);
            });
          }}
        />
      </div>
    </div>
  );
}
