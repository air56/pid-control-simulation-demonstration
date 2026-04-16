import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sliders, Activity, Code, Info } from 'lucide-react';

export default function PIDRef() {
  const [kp, setKp] = useState(2.0);
  const [ki, setKi] = useState(0.5);
  const [kd, setKd] = useState(0.1);
  const [target, setTarget] = useState(50);
  const [data, setData] = useState<any[]>([]);
  
  // Internal PID state
  const stateRef = useRef({
    currentValue: 0,
    integral: 0,
    lastError: 0,
    velocity: 0 // System inertia
  });

  const resetSimulation = () => {
    stateRef.current = { currentValue: 0, integral: 0, lastError: 0, velocity: 0 };
    setData([]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const { currentValue, integral, lastError, velocity } = stateRef.current;
      const dt = 0.1; // 100ms step
      
      const error = target - currentValue;
      const newIntegral = Math.max(-20, Math.min(20, integral + error * dt)); // Anti-windup
      const derivative = (error - lastError) / dt;
      
      const output = (kp * error) + (ki * newIntegral) + (kd * derivative);
      
      // Simulating a simple physical system (Inertia + Friction)
      const friction = 0.2;
      const acceleration = output - (velocity * friction);
      const newVelocity = velocity + acceleration * dt;
      const newValue = currentValue + newVelocity * dt;

      stateRef.current = {
        currentValue: newValue,
        integral: newIntegral,
        lastError: error,
        velocity: newVelocity
      };

      setData(prev => {
        const next = [...prev, { 
          time: prev.length, 
          value: parseFloat(newValue.toFixed(2)),
          target: target 
        }];
        return next.slice(-100); // Keep last 100 points
      });
    }, 100);

    return () => clearInterval(interval);
  }, [kp, ki, kd, target]);

  const codeSnippet = `// PID 控制标准写法
typedef struct {
    float Kp, Ki, Kd;
    float target;
    float integral;
    float lastError;
    float outputLimit; // 输出限幅
} PID_Controller;

float PID_Compute(PID_Controller *pid, float current, float dt) {
    float error = pid->target - current;
    
    // 1. 比例项
    float p_out = pid->Kp * error;
    
    // 2. 积分项 (带抗饱和 Anti-Windup)
    pid->integral += error * dt;
    // 简单限幅防止积分过大
    if (pid->integral > 100) pid->integral = 100;
    if (pid->integral < -100) pid->integral = -100;
    float i_out = pid->Ki * pid->integral;
    
    // 3. 微分项 (D项通常需要低通滤波以减少噪声)
    float derivative = (error - pid->lastError) / dt;
    float d_out = pid->Kd * derivative;
    
    float output = p_out + i_out + d_out;
    pid->lastError = error;
    
    return output;
}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="tech-card h-fit">
          <div className="flex items-center gap-2 mb-6">
            <Sliders className="w-5 h-5 text-[#8b5cf6]" />
            <h2 className="text-[18px] font-semibold text-[var(--color-text-main)]">PID 参数调节</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="tech-label m-0 text-[#8b5cf6]">Kp (比例)</label>
                <span className="font-mono text-[#8b5cf6] font-semibold">{kp.toFixed(1)}</span>
              </div>
              <input 
                type="range" min="0" max="10" step="0.1" value={kp} 
                onChange={e => setKp(parseFloat(e.target.value))}
                className="w-full accent-[#8b5cf6] bg-[var(--color-border)]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="tech-label m-0 text-[#10b981]">Ki (积分)</label>
                <span className="font-mono text-[#10b981] font-semibold">{ki.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0" max="2" step="0.01" value={ki} 
                onChange={e => setKi(parseFloat(e.target.value))}
                className="w-full accent-[#10b981] bg-[var(--color-border)]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label className="tech-label m-0 text-[var(--color-accent)]">Kd (微分)</label>
                <span className="font-mono text-[var(--color-accent)] font-semibold">{kd.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" value={kd} 
                onChange={e => setKd(parseFloat(e.target.value))}
                className="w-full accent-[var(--color-accent)] bg-[var(--color-border)]"
              />
            </div>

            <div className="pt-4 space-y-4">
              <div className="space-y-2">
                <label className="tech-label">目标值 (Setpoint)</label>
                <div className="flex gap-2">
                  <button onClick={() => setTarget(0)} className="tech-button flex-1 text-xs">0</button>
                  <button onClick={() => setTarget(50)} className="tech-button flex-1 text-xs">50</button>
                  <button onClick={() => setTarget(100)} className="tech-button flex-1 text-xs">100</button>
                </div>
              </div>
              <button 
                onClick={resetSimulation}
                className="w-full tech-button border-[var(--color-border)] text-[var(--color-code-text)] hover:bg-[#fef2f2] text-xs font-bold"
              >
                重置仿真
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Visualization */}
        <div className="tech-card xl:col-span-2 min-h-[400px]">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-[#10b981]" />
            <h2 className="text-[18px] font-semibold text-[var(--color-text-main)]">响应曲线仿真 (Step Response)</h2>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 120]} stroke="#64748b" fontSize={11} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Line 
                  type="monotone" dataKey="target" stroke="#94a3b8" 
                  strokeDasharray="5 5" strokeWidth={1.5} dot={false} isAnimationActive={false} 
                />
                <Line 
                  type="monotone" dataKey="value" stroke="#8b5cf6" 
                  strokeWidth={2} dot={false} isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 p-3 bg-[var(--color-code-bg)] rounded-lg border border-[var(--color-border)] flex justify-around text-xs font-mono">
            <div className="flex flex-col items-center">
              <span className="text-[var(--color-text-dim)] text-[10px] uppercase font-bold mb-1">SETPOINT</span>
              <span className="text-[var(--color-text-main)] font-semibold">{target}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[var(--color-text-dim)] text-[10px] uppercase font-bold mb-1">CURRENT</span>
              <span className="text-[#8b5cf6] font-bold">{stateRef.current.currentValue.toFixed(1)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[var(--color-text-dim)] text-[10px] uppercase font-bold mb-1">ERROR</span>
              <span className="text-[var(--color-code-text)] font-semibold">{(target - stateRef.current.currentValue).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tech-card">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-[var(--color-text-dim)]" />
            <h3 className="tech-label m-0">PID 核心代码 (C 实现示例)</h3>
          </div>
          <pre className="code-block whitespace-pre-wrap">
            {codeSnippet}
          </pre>
        </div>

        <div className="tech-card border-l-4 border-l-[#8b5cf6] border-y border-r flex flex-col justify-center">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-[#8b5cf6] shrink-0" />
            <div className="space-y-4 text-[var(--color-text-dim)]">
              <p className="font-semibold text-[var(--color-text-main)] underline decoration-[#8b5cf6]/30 underline-offset-4">调参口诀：</p>
              <div className="grid grid-cols-1 gap-3 italic text-[13px] leading-relaxed">
                <p>1. <span className="text-[#8b5cf6] font-semibold not-italic">P (Proportional)</span>: 参数由小向大调，消除静差看波动。 (控制响应速度)</p>
                <p>2. <span className="text-[#10b981] font-semibold not-italic">I (Integral)</span>: 积分由小向大调，静态误差归零平。 (消除控制死区和静差)</p>
                <p>3. <span className="text-[var(--color-accent)] font-semibold not-italic">D (Derivative)</span>: 微分抑制超调量，阻尼足够快回稳。 (预测未来，减少震荡)</p>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-sm">
                <p><span className="text-amber-500 font-bold">⚠️ 注意</span>: 积分项必须有限幅（抗饱和），否则在目标值大幅跳变时会导致严重超调。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
