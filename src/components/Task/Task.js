import { useState, useCallback } from 'react';
import axios from 'axios';
import DoneIcon from '../../icons/DoneIcon';
import delIcon from '../../images/delete.svg';
import { TaskStatus } from '../DayList/DayList';

import './Task.css';

export default function Task(props) {
  const { url, item, isDataChanged, setIsDataChanged } = props;

  const [value, setValue] = useState(item.title);
  const [isEdit, setIsEdit] = useState(false);

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
      setIsEdit(false);
    },
    [isDataChanged, url, setIsDataChanged]
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
    [isDataChanged, url, setIsDataChanged]
  );

  const onClickDelete = useCallback(
    (item) => {
      axios.delete(`${url}${item.id}`).then(setIsDataChanged(!isDataChanged));
    },
    [isDataChanged, url, setIsDataChanged]
  );

  return (
    <div className='Task'>
      {isEdit ? (
        <input
          className='Task__input'
          type='text'
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.code === 'Enter') {
              event.target.blur();
            }
          }}
          onBlur={(event) => onBlurChange(event, item)}
        />
      ) : (
        <div
          className={`Task__title${
            item.status === TaskStatus.DONE ? ' Task__title_done' : ''
          }`}
          onClick={() => setIsEdit(true)}
        >
          {item.title}
        </div>
      )}
      <div className='Task__itemButtons'>
        <div className='Task__iconWrapper' onClick={() => onClickDone(item)}>
          <DoneIcon className='Task__doneIcon' status={item.status} />
        </div>
        <img
          className='Task__deleteIcon'
          src={delIcon}
          onClick={() => onClickDelete(item)}
          alt='Удалить'
          width='19px'
          height='20px'
        />
      </div>
    </div>
  );
}
