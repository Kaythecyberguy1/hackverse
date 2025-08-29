import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  StopCircle, 
  Play, 
  Square, 
  Terminal, 
  Lightbulb, 
  Target, 
  Clock, 
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useApi } from '../services/api';

export default function TerminalPanel({ activeLab, flag, setFlag, onSubmitFlag, onStop }) {
  const api = useApi();
  const [currentHint, setCurrentHint] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [isTerminalActive, setIsTerminalActive] = useState(false);
  const [labStatus, setLabStatus] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (activeLab) {
      loadLabStatus();
      startTimer();
      initializeTerminal();
    }
    return () => {
      if (activeLab) {
        stopTimer();
      }
    };
  }, [activeLab]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const loadLabStatus = async () => {
    if (activeLab) {
      const status = await api.getLabStatus(activeLab.id);
      setLabStatus(status);
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  };

  const stopTimer = () => {
    setTimeElapsed(0);
  };

  const initializeTerminal = () => {
    setTerminalOutput([
      { type: 'info', message: `🚀 ${activeLab.name} terminal initialized` },
      { type: 'info', message: 'Type "help" for available commands' },
      { type: 'info', message: 'Type "hint" to get help with the current challenge' },
      { type: 'info', message: 'Type "status" to check lab status' },
      { type: 'info', message: 'Type "clear" to clear terminal' }
    ]);
  };

  const executeCommand = (command) => {
    const cmd = command.toLowerCase().trim();
    
    switch (cmd) {
      case 'help':
        setTerminalOutput(prev => [...prev, {
          type: 'command',
          message: `$ ${command}`
        }, {
          type: 'info',
          message: 'Available commands: help, hint, status, clear, ports, walkthrough'
        }]);
        break;
      
      case 'hint':
        if (activeLab.hints && activeLab.hints.length > 0) {
          setTerminalOutput(prev => [...prev, {
            type: 'command',
            message: `$ ${command}`
          }, {
            type: 'hint',
            message: `💡 Hint ${currentHint + 1}: ${activeLab.hints[currentHint]}`
          }]);
          setCurrentHint((prev) => (prev + 1) % activeLab.hints.length);
        } else {
          setTerminalOutput(prev => [...prev, {
            type: 'command',
            message: `$ ${command}`
          }, {
            type: 'error',
            message: 'No hints available for this lab'
          }]);
        }
        break;
      
      case 'status':
        setTerminalOutput(prev => [...prev, {
          type: 'command',
          message: `$ ${command}`
        }, {
          type: 'info',
          message: `Lab: ${activeLab.name} | Status: ${labStatus?.status || 'Unknown'} | Time: ${formatTime(timeElapsed * 1000)}`
        }]);
        break;
      
      case 'ports':
        if (activeLab.ports) {
          const portInfo = Object.entries(activeLab.ports).map(([internal, external]) => 
            `Port ${internal} → localhost:${external}`
          ).join('\n');
          setTerminalOutput(prev => [...prev, {
            type: 'command',
            message: `$ ${command}`
          }, {
            type: 'info',
            message: `Port mappings:\n${portInfo}`
          }]);
        }
        break;
      
      case 'walkthrough':
        setTerminalOutput(prev => [...prev, {
          type: 'command',
          message: `$ ${command}`
        }, {
          type: 'info',
          message: `📚 Walkthrough available at: ${activeLab.walkthrough}`
        }]);
        break;
      
      case 'clear':
        setTerminalOutput([]);
        break;
      
      default:
        setTerminalOutput(prev => [...prev, {
          type: 'command',
          message: `$ ${command}`
        }, {
          type: 'error',
          message: `Command not found: ${command}. Type "help" for available commands.`
        }]);
    }
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (terminalInput.trim()) {
      executeCommand(terminalInput);
      setTerminalInput('');
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (!activeLab) {
    return (
      <div className="text-center py-12">
        <Terminal className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-400 mb-2">No Active Lab</h3>
        <p className="text-gray-500">Start a lab from the Labs tab to access the terminal</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lab Status Header */}
      <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-3">
            <Terminal className="w-6 h-6 text-cyan-400" />
            {activeLab.name} - Terminal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lab Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Time: {formatTime(timeElapsed * 1000)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-4 h-4" />
              <span>Difficulty: {activeLab.difficulty}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Info className="w-4 h-4" />
              <span>Category: {activeLab.category}</span>
            </div>
          </div>

          {/* Port Information */}
          {activeLab.ports && (
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/50">
              <h4 className="text-sm font-medium text-white mb-2">Lab Access Points:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(activeLab.ports).map(([internal, external]) => (
                  <div key={internal} className="flex items-center gap-2 bg-gray-700/50 px-3 py-1 rounded-md">
                    <span className="text-xs text-gray-400">Port {internal}</span>
                    <span className="text-xs text-gray-300">→</span>
                    <span className="text-xs text-cyan-400">localhost:{external}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-cyan-400"
                      onClick={() => copyToClipboard(`localhost:${external}`)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowHints(!showHints)}
              variant="outline"
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHints ? 'Hide' : 'Show'} Hints ({activeLab.hints?.length || 0})
            </Button>
            
            <Button
              onClick={() => window.open(activeLab.walkthrough, '_blank')}
              variant="outline"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Walkthrough
            </Button>

            <Button
              onClick={onStop}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <StopCircle className="w-4 h-4 mr-2" />
              Stop Lab
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hints Panel */}
      {showHints && activeLab.hints && (
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-400 text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Hints & Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeLab.hints.map((hint, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="w-6 h-6 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-yellow-100 text-sm leading-relaxed">{hint}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terminal */}
      <Card className="bg-black border border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Terminal className="w-5 h-5 text-green-400" />
            Interactive Terminal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Terminal Output */}
          <div 
            ref={terminalRef}
            className="h-64 bg-black border border-gray-600 rounded-lg p-4 font-mono text-sm overflow-y-auto"
          >
            {terminalOutput.map((output, index) => (
              <div key={index} className={`mb-2 ${
                output.type === 'command' ? 'text-green-400' :
                output.type === 'error' ? 'text-red-400' :
                output.type === 'hint' ? 'text-yellow-400' :
                'text-gray-300'
              }`}>
                {output.message}
              </div>
            ))}
            <div className="text-green-400">$ <span className="animate-pulse">_</span></div>
          </div>

          {/* Terminal Input */}
          <form onSubmit={handleTerminalSubmit} className="flex gap-2">
            <Input
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Enter command..."
              className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 font-mono"
            />
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Execute
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Flag Submission */}
      <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Submit Flag
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="Enter flag (e.g., FLAG{...})"
              className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
            <Button 
              onClick={onSubmitFlag}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Submit flags as you find them to track your progress
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
