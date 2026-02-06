import { useState, useEffect } from 'react';
import api from '../../api/axios';

const QuestionBank = () => {
  const [banks, setBanks] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showBankForm, setShowBankForm] = useState(false);
  const [showAIForm, setShowAIForm] = useState(false);
  const [bankData, setBankData] = useState({ name: '', description: '', category: '' });
  const [aiData, setAiData] = useState({ topic: '', numQuestions: 5, difficulty: 'medium' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await api.get('/quizzes/banks');
      setBanks(response.data.data);
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  const fetchQuestions = async (bankId) => {
    try {
      const response = await api.get(`/quizzes/banks/${bankId}/questions`);
      setQuestions(response.data.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
    fetchQuestions(bank._id);
  };

  const handleCreateBank = async (e) => {
    e.preventDefault();
    try {
      await api.post('/quizzes/banks', bankData);
      alert('Question bank created successfully');
      setShowBankForm(false);
      setBankData({ name: '', description: '', category: '' });
      fetchBanks();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create bank');
    }
  };

  const handleGenerateAI = async (e) => {
    e.preventDefault();
    if (!selectedBank) {
      alert('Please select a question bank first');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/quizzes/generate', {
        bankId: selectedBank._id,
        ...aiData
      });
      alert(`Generated ${response.data.count} questions successfully!`);
      setShowAIForm(false);
      fetchQuestions(selectedBank._id);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Question Banks</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setShowBankForm(!showBankForm)} className="btn btn-primary">
          {showBankForm ? 'Cancel' : 'Create Bank'}
        </button>
        {selectedBank && (
          <button onClick={() => setShowAIForm(!showAIForm)} className="btn btn-primary">
            {showAIForm ? 'Cancel' : 'AI Generate Questions'}
          </button>
        )}
      </div>

      {showBankForm && (
        <div className="card">
          <h2>Create Question Bank</h2>
          <form onSubmit={handleCreateBank}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={bankData.name}
                onChange={(e) => setBankData({ ...bankData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                value={bankData.description}
                onChange={(e) => setBankData({ ...bankData, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                className="form-control"
                value={bankData.category}
                onChange={(e) => setBankData({ ...bankData, category: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">Create</button>
          </form>
        </div>
      )}

      {showAIForm && (
        <div className="card">
          <h2>AI Generate Questions</h2>
          <form onSubmit={handleGenerateAI}>
            <div className="form-group">
              <label>Topic</label>
              <input
                type="text"
                className="form-control"
                value={aiData.topic}
                onChange={(e) => setAiData({ ...aiData, topic: e.target.value })}
                placeholder="e.g., World War II, Python Basics, Photosynthesis"
                required
              />
            </div>
            <div className="form-group">
              <label>Number of Questions</label>
              <input
                type="number"
                className="form-control"
                value={aiData.numQuestions}
                onChange={(e) => setAiData({ ...aiData, numQuestions: e.target.value })}
                min="1"
                max="10"
              />
            </div>
            <div className="form-group">
              <label>Difficulty</label>
              <select
                className="form-control"
                value={aiData.difficulty}
                onChange={(e) => setAiData({ ...aiData, difficulty: e.target.value })}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Questions'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        <div className="card">
          <h2>Banks</h2>
          {banks.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {banks.map((bank) => (
                <li
                  key={bank._id}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    background: selectedBank?._id === bank._id ? '#eff6ff' : 'transparent',
                    borderRadius: '5px',
                    marginBottom: '5px'
                  }}
                  onClick={() => handleSelectBank(bank)}
                >
                  <strong>{bank.name}</strong>
                  {bank.category && <div style={{ fontSize: '12px', color: '#6b7280' }}>{bank.category}</div>}
                </li>
              ))}
            </ul>
          ) : (
            <p>No question banks yet.</p>
          )}
        </div>

        <div className="card">
          <h2>Questions</h2>
          {selectedBank ? (
            questions.length > 0 ? (
              <div>
                {questions.map((q, index) => (
                  <div key={q._id} style={{ marginBottom: '20px', padding: '15px', background: '#f9fafb', borderRadius: '5px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                      {index + 1}. {q.questionText}
                    </div>
                    {q.options && q.options.length > 0 && (
                      <div style={{ marginLeft: '20px' }}>
                        {q.options.map((opt, i) => (
                          <div key={i} style={{ padding: '5px 0', color: opt === q.correctAnswer ? '#065f46' : '#374151' }}>
                            {String.fromCharCode(65 + i)}. {opt}
                            {opt === q.correctAnswer && ' ✓'}
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#6b7280' }}>
                      <span className={`badge badge-${q.difficulty === 'easy' ? 'success' : q.difficulty === 'hard' ? 'danger' : 'warning'}`}>
                        {q.difficulty}
                      </span>
                      {q.explanation && (
                        <div style={{ marginTop: '5px' }}>
                          <em>Explanation: {q.explanation}</em>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No questions in this bank yet.</p>
            )
          ) : (
            <p>Select a question bank to view questions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
