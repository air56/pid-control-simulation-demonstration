import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Play, RefreshCcw, Code, Info, AlertTriangle } from 'lucide-react';

enum States {
  IDLE = 'IDLE',
  HEATING = 'HEATING',
  RUNNING = 'RUNNING',
  ERROR = 'ERROR'
}

export default function StateMachineRef() {
  const [state, setState] = useState<States>(States.IDLE);
  const [temp, setTemp] = useState(25);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  // State Machine simulation loop
  useEffect(() => {
    const timer = setInterval(() => {
      switch (state) {
        case States.IDLE:
          if (temp > 25) setTemp(t => t - 0.5);
          break;
        case States.HEATING:
          setTemp(t => t + 2);
          if (temp >= 50) {
            setState(States.RUNNING);
            addLog('Temp reached 50°C. Switching to RUNNING.');
          }
          break;
        case States.RUNNING:
          if (temp > 50) setTemp(t => t + 0.5);
          if (temp > 80) {
            setState(States.ERROR);
            addLog('CRITICAL! Overheat detected.');
          }
          break;
        case States.ERROR:
          break;
      }
    }, 500);
    return () => clearInterval(timer);
  }, [state, temp]);

  const handleStart = () => {
    if (state === States.IDLE) {
      setState(States.HEATING);
      addLog('Process started. Heating up...');
    }
  };

  const handleReset = () => {
    setState(States.IDLE);
    setTemp(25);
    addLog('System reset.');
  };

  const codeSnippet = `// 状态机 (FSM) 标准写法
enum State { IDLE, HEATING, RUNNING, ERROR };

State currentState = IDLE;

void handle_system() {
    switch (currentState) {
        case IDLE:
            if (startButtonAction()) {
                currentState = HEATING;
            }
            break;
            
        case HEATING:
            heatUp();
            if (getTemp() >= 50) {
                currentState = RUNNING;
            }
            break;
            
        case RUNNING:
            doTask();
            if (getTemp() > 80) {
                currentState = ERROR;
            }
            break;
            
        case ERROR:
            alertUser();
            if (resetButton()) currentState = IDLE;
            break;
    }
}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tech-card">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-[#f97316]" />
            <h2 className="text-[18px] font-semibold text-[var(--color-text-main)]">状态机逻辑可视化 (FSM)</h2>
          </div>
          
          <div className="space-y-8">
            {/* Visual States */}
            <div className="flex justify-between items-center relative py-12 px-4">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--color-border)] -translate-y-1/2" />
              
              {Object.values(States).map((s) => (
                <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                  <motion.div 
                    animate={{ 
                      scale: state === s ? 1.2 : 1,
                      backgroundColor: state === s ? 
                        (s === States.ERROR ? '#ef4444' : '#f97316') : 
                        'var(--color-border)',
                      borderColor: state === s ? '#fff' : 'var(--color-border)'
                    }}
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm"
                  >
                    {s === States.ERROR && <AlertTriangle className="w-5 h-5 text-white" />}
                    {s === States.IDLE && <div className="w-2 h-2 rounded-full bg-[var(--color-text-dim)]" />}
                    {s === States.HEATING && <Play className="w-4 h-4 text-white fill-current" />}
                    {s === States.RUNNING && <RefreshCcw className="w-4 h-4 text-white" />}
                  </motion.div>
                  <span className={`text-[10px] font-mono ${state === s ? 'text-[var(--color-text-main)] font-bold' : 'text-[var(--color-text-dim)]'}`}>
                    {s}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-[var(--color-bg)] p-6 rounded-lg border border-[var(--color-border)] space-y-4">
              <div className="flex justify-between items-center">
                <span className="tech-label m-0 text-[11px] text-[var(--color-text-dim)]">模拟传感器温度</span>
                <span className={`text-2xl font-mono font-bold ${temp > 70 ? 'text-[#ef4444]' : 'text-[#f97316]'}`}>
                  {temp.toFixed(1)}°C
                </span>
              </div>
              <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${temp > 70 ? 'bg-[#ef4444]' : 'bg-[#f97316]'}`}
                  animate={{ width: `${Math.min(100, (temp / 100) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleStart}
                disabled={state !== States.IDLE}
                className="flex-1 tech-button flex items-center justify-center gap-2 bg-[#fff7ed] text-[#ea580c] border-[#ffedd5] hover:bg-[#ffedd5] disabled:bg-[var(--color-bg)] disabled:text-[var(--color-text-dim)] disabled:border-[var(--color-border)]"
              >
                <Play className="w-4 h-4" /> 开始流程
              </button>
              <button 
                onClick={handleReset}
                className="flex-1 tech-button flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" /> 系统复位
              </button>
            </div>
            
            <div className="space-y-2">
              <p className="tech-label text-[11px] text-[var(--color-text-dim)]">系统运行日志</p>
              <div className="bg-[var(--color-code-bg)] border border-[var(--color-border)] rounded-lg p-3 h-32 font-mono text-[12px] overflow-y-auto space-y-1">
                <AnimatePresence>
                  {logs.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[#334155]"
                    >
                      {`> ${log}`}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="tech-card h-fit">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-[var(--color-text-dim)]" />
              <h3 className="tech-label m-0 text-[11px]">标准 FSM 写法 (C 风格)</h3>
            </div>
            <pre className="code-block">
              {codeSnippet}
            </pre>
          </div>

          <div className="tech-card border-l-4 border-l-[#f97316] flex-1">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-[#f97316] shrink-0" />
              <div className="space-y-4 text-[var(--color-text-dim)]">
                <p className="font-semibold text-[var(--color-text-main)] underline decoration-[#f97316]/30 underline-offset-4">要点总结：</p>
                <ul className="list-disc list-inside space-y-2 text-[13px] leading-relaxed">
                  <li><span className="text-[#f97316] font-medium">枚举定义</span>：使用 Enum 强制限定状态集合，增加自描述性。</li>
                  <li><span className="text-[#f97316] font-medium">单入口切换</span>：推荐在主循环中使用 <code className="bg-[var(--color-border)] px-1 py-0.5 rounded text-[12px]">switch-case</code>。</li>
                  <li><span className="text-[#f97316] font-medium">事件驱动</span>：通过外部事件（按钮、传感器阈值）触发状态跳转。</li>
                  <li><span className="text-[#f97316] font-medium">分层设计</span>：复杂逻辑建议使用 "状态机 + 子状态机" 或状态树。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
