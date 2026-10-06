# Sound notification rules

The user requires audible notifications when their attention is needed
and when the current task is finished.

- Play an alert sound immediately before requesting user confirmation,
  approval, or required input.
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
