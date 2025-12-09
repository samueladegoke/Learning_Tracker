# BMAD Agent Voice Mappings

This file maps each BMAD agent to a unique TTS voice for multi-agent conversations.

**Provider-Aware:** This configuration supports both ElevenLabs and Piper TTS providers. The system automatically selects the appropriate voice column based on your active provider.

## Voice Assignment Table

| Agent ID | Agent Name | Intro | ElevenLabs Voice | Piper Voice | Personality |
|----------|------------|-------|------------------|-------------|-------------|
| pm | Product Manager | Product Manager here | Matthew Schmitz | en_US-joe-medium | professional |
| dev | Developer | Developer speaking | Aria | en_US-amy-medium | normal |
| analyst | Business Analyst | Business Analyst reporting | Jessica Anne Bogart | en_US-kristin-medium | professional |
| architect | Architect | Architect here | Michael | en_GB-alan-medium | professional |
| sm | Scrum Master | Scrum Master here | Matthew Schmitz | en_US-joe-medium | professional |
| tea | Test Architect | Test Architect speaking | Michael | en_US-arctic-medium | professional |
| tech-writer | Technical Writer | Technical Writer here | Aria | en_US-lessac-medium | professional |
| ux-designer | UX Designer | UX Designer speaking | Jessica Anne Bogart | en_US-lessac-medium | professional |
| quick-flow-solo-dev | Solo Developer | Solo Developer here | Aria | en_US-amy-medium | normal |
| bmad-master | BMAD Master | BMAD Master activated | Michael | en_US-danny-low | professional |

## Usage

- **ElevenLabs Provider**: Uses the "ElevenLabs Voice" column
- **Piper Provider**: Uses the "Piper Voice" column (neural voice IDs)

## Customization

Edit this file to change voice assignments. The system will automatically detect your active TTS provider and use the appropriate voice column.

## Personality Notes

- `professional`: Formal, clear, business-appropriate tone
- `normal`: Friendly, conversational, balanced tone





