import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button.jsx';
import Card from '../../components/Card/Card.jsx';

const LetsBuild = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full items-center justify-center">
      <Card className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-body">Let&apos;s Build Together</h1>
        <p className="mt-3 text-sm text-muted">
          Collaboration spaces are coming soon. For now, head back to the home feed to keep exploring ideas and
          projects from your peers.
        </p>
        <Button variant="primary" className="mt-6" onClick={() => navigate('/')}>Return to Home</Button>
      </Card>
    </div>
  );
};

export default LetsBuild;
