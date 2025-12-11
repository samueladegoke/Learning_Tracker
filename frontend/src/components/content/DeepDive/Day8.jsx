import CodeBlock from '../../CodeBlock'
import { Lightbulb } from 'lucide-react'

export default function DeepDiveDay8() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Loop Over Sections Here */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">1.</span> Functions with Inputs
                    </h2>
                    <p>Parameters are the names of the variables inside the function definition, while Arguments are the actual values passed to the function call.</p>
                    <CodeBlock code={`def greet_with_name(name): # name is the Parameter
  print(f"Hello {name}")

greet_with_name("Jack") # "Jack" is the Argument`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">2.</span> Positional vs. Keyword Arguments
                    </h2>
                    <p>Positional arguments must be in the correct order. Keyword arguments allow you to specify which parameter each argument corresponds to, ignoring order.</p>
                    <CodeBlock code={`# Positional
greet("Jack", "London")

# Keyword
greet(location="London", name="Jack")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">3.</span> Caesar Cipher
                    </h2>
                    <p>The Caesar cipher is a simple encryption technique where each letter in the text is shifted by a fixed number of positions down the alphabet.</p>
                    <CodeBlock code={`alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

def caesar(start_text, shift_amount, cipher_direction):
  end_text = ""
  if cipher_direction == "decode":
    shift_amount *= -1
  for char in start_text:
    if char in alphabet:
      position = alphabet.index(char)
      new_position = position + shift_amount
      end_text += alphabet[new_position]
    else:
      end_text += char
  print(f"Here's the {cipher_direction}d result: {end_text}")`} language="python" />
                </section>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-surface-800 rounded-lg border border-surface-700">
                            <h4 className="font-bold text-primary-300 mb-2">Index Errors</h4>
                            <p className="text-sm text-surface-300">Be careful when shifting past 'z'. You might need to use modulo operator % or duplicate the alphabet list.</p>
                        </div>
                        <div className="p-4 bg-surface-800 rounded-lg border border-surface-700">
                            <h4 className="font-bold text-primary-300 mb-2">Naming</h4>
                            <p className="text-sm text-surface-300">Choose clear and descriptive parameter names to make your code readable.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
