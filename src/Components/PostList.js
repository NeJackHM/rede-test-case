import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Form, Pagination } from 'react-bootstrap';
import '../Styles/PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [titleOrder, setTitleOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [idFilter, setIdFilter] = useState(''); // Nuevo estado para el filtro por ID
  const postsPerPage = 15;

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setPosts(response.data);
    };
    fetchPosts();  
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesUserId = !userIdFilter || post.userId === parseInt(userIdFilter);
    const matchesSearchQuery = post.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesId = !idFilter || post.id === parseInt(idFilter);

    return matchesUserId && matchesSearchQuery && matchesId;
  });

  const sortedPosts = filteredPosts.sort((a, b) => {
    if (titleOrder === 'asc') {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = sortedPosts.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container className="container">
      <Form.Control
        type="text"
        placeholder="Buscar por ID"
        value={idFilter}
        onChange={(e) => setIdFilter(e.target.value)}
        className="mb-3"
      />
      <Form.Control
        type="text"
        placeholder="Buscar por Contenido"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-3"
      />
      <Table className="table" striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>
              Título
              <button onClick={() => setTitleOrder(titleOrder === 'asc' ? 'desc' : 'asc')}>
                {titleOrder === 'asc' ? '↓' : '↑'}
              </button>
            </th>
            <th>Contenido</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map(post => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.body}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="pagination">
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>
    </Container>
  );
}

export default PostList;
