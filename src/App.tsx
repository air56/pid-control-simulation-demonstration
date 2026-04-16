/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, Sliders, Layers, ChevronRight, Github } from 'lucide-react';
import EncoderRef from './components/EncoderRef';
import PIDRef from './components/PIDRef';
import StateMachineRef from './components/StateMachineRef';

type Tab = 'encoder' | 'pid' | 'fsm';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('encoder');

  const tabs = [
    { id: 'encoder', label: '编码器 (Encoder)', icon: RotateCw, color: 'text-blue-400' },
    { id: 'pid', label: 'PID 控制 (PID)', icon: Sliders, color: 'text-purple-400' },
    { id: 'fsm', label: '状态机 (FSM)', icon: Layers, color: 'text-orange-400' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card-bg)] px-6 py-8 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col">
            <h1 className="text-[24px] font-bold tracking-tight">嵌入式开发标准代码模式摘要</h1>
            <p className="text-[var(--color-text-dim)] text-[14px] mt-1">针对编码器、PID控制器及有限状态机的标准化工业实现参考</p>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex bg-[var(--color-code-bg)] p-1 rounded-lg border border-[var(--color-border)]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${
                    activeTab === tab.id 
                    ? 'bg-white text-[var(--color-accent)] font-bold shadow-sm' 
                    : 'text-[var(--color-text-dim)] hover:text-[var(--color-text-main)]'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 md:px-12 md:py-8">
        <section className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'encoder' && <EncoderRef />}
              {activeTab === 'pid' && <PIDRef />}
              {activeTab === 'fsm' && <StateMachineRef />}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-card-bg)] px-6 py-6 md:px-12 flex flex-col md:flex-row justify-between text-[12px] text-[var(--color-text-dim)] items-center">
        <div>&copy; 2024 系统架构设计文档 · 内部参考资料</div>
        <div className="mt-2 md:mt-0">版本 1.2.0 | 更新于 2024年10月</div>
      </footer>
    </div>
  );
}
