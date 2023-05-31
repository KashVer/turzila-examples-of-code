export const Pagination = ({ total }) => {
  return (
    <ul className="pagination justify-content-center">
      {Array(Math.ceil(total / 10))
        .fill(null)
        .map((_, index) => {
          return (
            <li className="page-item" key={index}>
              <a className="page-link" href={`?skip=${index * 10}`}>
                {index + 1}
              </a>
            </li>
          );
        })}
    </ul>
  );
};
