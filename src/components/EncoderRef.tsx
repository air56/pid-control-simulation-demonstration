import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCw, Info, Code } from 'lucide-react';

export default function EncoderRef() {
  const [phaseA, setPhaseA] = useState(false);
  const [phaseB, setPhaseB] = useState(false);
  const [count, setCount] = useState(0);
  const [lastA, setLastA] = useState(false);

  // Encoder Logic: Standard A/B Phase Decoding
  useEffect(() => {
    if (phaseA !== lastA) {
      if (phaseA === phaseB) {
        setCount(c => c - 1); // Counter-clockwise
      } else {
        setCount(c => c + 1); // Clockwise
      }
      setLastA(phaseA);
    }
  }, [phaseA, phaseB, lastA]);

  const codeSnippet = `// 编码器标准写法 (正交编码 A/B Phase)
// 在硬件中通常通过外部中断触发
volatile long count = 0;
bool lastA = false;

void IRAM_ATTR encoder_isr() {
  bool currentA = digitalRead(PHASE_A_PIN);
  bool currentB = digitalRead(PHASE_B_PIN);
  
  if (currentA != lastA) {
    // A相上升沿或下降沿
    if (currentA == currentB) {
      count--;
    } else {
      count++;
    }
  }
  lastA = currentA;
}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tech-card">
          <div className="flex items-center gap-2 mb-4">
            <RotateCw className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="text-[18px] font-semibold text-[var(--color-text-main)]">正交编码器模拟 (Quadrature Encoder)</h2>
          </div>
          
          <div className="flex flex-col items-center justify-center py-10 space-y-8">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <motion.div 
                className="absolute inset-0 border-4 border-dashed border-[var(--color-border)] rounded-full"
                animate={{ rotate: count * 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <div className="text-4xl font-mono font-bold text-[var(--color-accent)]">{count}</div>
              <div className="absolute -bottom-8 tech-label">编码器数值 (Ticks)</div>
            </div>

            <div className="flex gap-4">
              <button 
                onMouseDown={() => setPhaseA(prev => !prev)}
                className="tech-button flex flex-col items-center gap-1 w-24"
              >
                <div className={`w-4 h-4 rounded-full ${phaseA ? 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[var(--color-border)]'}`} />
                <span className="text-[12px] font-medium text-[var(--color-text-main)]">Phase A</span>
              </button>
              <button 
                onMouseDown={() => setPhaseB(prev => !prev)}
                className="tech-button flex flex-col items-center gap-1 w-24"
              >
                <div className={`w-4 h-4 rounded-full ${phaseB ? 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[var(--color-border)]'}`} />
                <span className="text-[12px] font-medium text-[var(--color-text-main)]">Phase B</span>
              </button>
            </div>

            <div className="text-[13px] text-[var(--color-text-dim)] max-w-sm text-center leading-relaxed">
              手动点击模拟 A/B 相状态切换。正交编码器通过 A、B 两相的相位差（通常为90度）来判断旋转方向和速度。
            </div>
          </div>
        </div>

        <div className="tech-card">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-[var(--color-text-dim)]" />
            <h3 className="tech-label m-0">标准核心代码 (C/C++)</h3>
          </div>
          <pre className="code-block h-full min-h-[300px]">
            {codeSnippet}
          </pre>
        </div>
      </div>

      <div className="tech-card border-l-4 border-l-[var(--color-accent)] border-y border-r">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
          <div className="space-y-4 text-[var(--color-text-dim)]">
            <p className="font-semibold text-[var(--color-text-main)] underline decoration-blue-500/30 underline-offset-4">要点总结：</p>
            <ul className="list-disc list-inside space-y-2 text-[13px] leading-relaxed">
              <li><span className="text-[var(--color-accent)] font-medium">信号识别</span>：A、B 相通常是 90° 位相差。</li>
              <li><span className="text-[var(--color-accent)] font-medium">方向判定</span>：若 A 相跳变时 A == B，代表一个方向；若 A != B，代表另一个方向。</li>
              <li><span className="text-[var(--color-accent)] font-medium">倍频策略</span>：仅对 A 相跳变检测是 2 倍频，对 A、B 跳变都检测是 4 倍频。</li>
              <li><span className="text-[var(--color-accent)] font-medium">硬件消抖</span>：工业环境中建议使用电容硬件滤波或软件限频率消抖。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
