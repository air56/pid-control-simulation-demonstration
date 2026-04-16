<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2ec43091-0209-4244-a03a-2bcacc135ed8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
并不是“高低变化幅度越大越好”。相反，在 PID 控制中，变化幅度（震荡）越小、越快稳定到目标值，才说明 PID 调得越好。
在您看到的曲线中，目标值（Setpoint，通常用虚线表示）是您希望系统达到的状态，而当前值（Current，实线表示）是系统的实际状态。
一个优秀的 PID 参数调节，其响应曲线应该具备以下三个特征：
1. 响应快（上升时间短）
当目标从 0 变到 50 时，系统能够迅速做出反应，曲线要陡峭地向 50 逼近。
影响参数： 主要由比例系数 Kp 决定。Kp 越大，响应越快，但过大的 Kp 会导致剧烈震荡（高低幅度变化极大）。
2. 超调小（震荡幅度小）
“超调”是指当前值冲过了目标值（比如目标是 50，结果冲到了 60 甚至 70）。我们希望超调越小越好，也就是您说的“高低变化幅度”要小。
影响参数： 微分系数 Kd 就像是汽车的刹车/阻尼，它能预测未来的误差变化。适当增大 Kd 可以“压住”向上冲的势头，减少震荡幅度。
3. 无静差（稳态误差小）
当曲线最终平缓下来时，它必须和目标值（虚线）完全重合。如果它停在了 48，说明还有“静态误差”（静差）。
影响参数： 积分系数 Ki 负责消除这个差距。只要存在误差，Ki 就会不断累积力量，直到把当前值硬生生拉到 50 为止。
如何在这个仿真页面里验证？
您可以尝试调整左侧的滑块来观察这三种现象：
制造巨大震荡（不好）：把 Kp 调到最大（比如 10），把 Kd 调到 0。您会看到曲线在目标值上下剧烈地疯狂跳动，这就是幅度最大、最差的控制状态（系统失控）。
制造迟缓响应（不好）：把 Kp 调得非常小（比如 0.5），把 Ki 也调小。您会发现曲线像蜗牛一样慢吞吞地爬向 50，甚至很久都达不到。
寻找完美状态（优秀）：不断微调这三个值，直到您切换目标值时，曲线能**“嗖”地一下上去，然后稳稳当当地停在虚线上，几乎没有上下波动的尖峰**。这时候，您的 PID 就达到最佳状态了。
