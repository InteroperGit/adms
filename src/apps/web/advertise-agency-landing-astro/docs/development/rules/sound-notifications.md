# Sound notification rules

The user requires audible notifications when their attention is needed
and when the current task is finished.

- Play an alert sound immediately before every request that needs an action
  from the user: approval, confirmation, required input, or a manual step.
  This includes tool-generated approval prompts, sandbox escalation,
  permission retries, and requests made through user-input tools or chat.
- Play a separate alert for each request, including repeated approvals and
  follow-up confirmations in the same task. An earlier alert does not cover
  a later request. Task-completion sounds do not replace attention alerts.
- Finish synchronous alert playback before invoking the tool or sending
  the message that asks for the user's action. For tool approval requests,
  play the sound in a separate preceding tool call; do not place playback
  inside the command awaiting approval, where it would run only afterward.
- Play a completion sound once when the current task finishes, immediately
  before the final response.
- Use `Alarm01.wav` for attention and the generic notification sound for
  completion. Keep these sounds distinct.
- The primary agent handles notifications for delegated tasks. Subagents
  should not produce duplicate completion sounds.
- Use the local operating system's sound facility. On Windows PowerShell:

  ```powershell
  # Attention required.
  $attentionPlayer = [System.Media.SoundPlayer]::new(
    'C:\Windows\Media\Alarm01.wav'
  )
  $attentionPlayer.PlaySync()

  # Task finished.
  $completionPlayer = [System.Media.SoundPlayer]::new(
    'C:\Windows\Media\Windows Notify System Generic.wav'
  )
  $completionPlayer.PlaySync()
  ```

- Use synchronous playback so the process does not exit before the sound
  finishes. Do not change system volume automatically.

- This instruction authorizes these local sounds; do not request separate
  confirmation merely to play them. Existing execution permissions apply.
- If playback fails or is unavailable, continue the task and briefly report
  the limitation. Successful execution does not prove the sound was audible;
  system volume and sound settings control playback.
