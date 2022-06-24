import { TaskStatus } from '../components/DayList/DayList';

export default function DoneIcon(props) {
  const status = props.status;

  return (
    <svg
      className={props.className}
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
        fill={status === TaskStatus.TODO ? 'url(#paint0_linear_201_4)' : 'gray'}
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
  );
}
