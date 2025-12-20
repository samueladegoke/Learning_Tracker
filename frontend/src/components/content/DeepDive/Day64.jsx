import React from 'react';
import CodeBlock from '../../CodeBlock';
import { Lightbulb } from 'lucide-react';

export default function DeepDiveDay64() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Project Overview */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Top 10 Movies Project
                    </h2>
                    <p>
                        Today you'll build a <strong>movie ranking website</strong> where you can:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Search for movies using the <strong>TMDB API</strong></li>
                        <li>Add movies to your personal database</li>
                        <li>Rate and review each movie</li>
                        <li>See movies ranked by your ratings</li>
                    </ul>
                </section>

                {/* Section 2: TMDB API Integration */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> TMDB API Integration
                    </h2>
                    <p>
                        The Movie Database (TMDB) provides a free API for movie information. You'll need to sign up for an API key.
                    </p>
                    <CodeBlock
                        code={`import requests

TMDB_API_KEY = "your_api_key"
TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie"
TMDB_IMG_URL = "https://image.tmdb.org/t/p/w500"

def search_movies(query):
    response = requests.get(
        TMDB_SEARCH_URL,
        params={"api_key": TMDB_API_KEY, "query": query}
    )
    return response.json()["results"]`}
                        language="python"
                    />
                </section>

                {/* Section 3: Movie Model */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> The Movie Model
                    </h2>
                    <p>
                        Create a comprehensive model to store all movie details.
                    </p>
                    <CodeBlock
                        code={`class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), unique=True, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(500), nullable=False)
    rating = db.Column(db.Float, nullable=True)
    ranking = db.Column(db.Integer, nullable=True)
    review = db.Column(db.String(250), nullable=True)
    img_url = db.Column(db.String(250), nullable=False)`}
                        language="python"
                    />
                </section>

                {/* Section 4: Dynamic Ranking */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Dynamic Ranking
                    </h2>
                    <p>
                        Instead of storing a static ranking, query movies sorted by rating and use <code>loop.index</code> in the template.
                    </p>
                    <CodeBlock
                        code={`# In your route
movies = Movie.query.order_by(Movie.rating.desc()).all()

# In your template
{% for movie in movies %}
    <div class="card">
        <span class="ranking">{{ loop.index }}</span>
        <h2>{{ movie.title }}</h2>
        <p>Rating: {{ movie.rating }}/10</p>
    </div>
{% endfor %}`}
                        language="python"
                    />
                </section>

                {/* Section 5: Edit and Delete */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Edit and Delete Routes
                    </h2>
                    <p>
                        Pass the movie ID as a query parameter to identify which record to modify.
                    </p>
                    <CodeBlock
                        code={`@app.route('/edit', methods=['GET', 'POST'])
def edit():
    movie_id = request.args.get('id')
    movie = Movie.query.get(movie_id)
    form = EditForm()
    if form.validate_on_submit():
        movie.rating = form.rating.data
        movie.review = form.review.data
        db.session.commit()
        return redirect(url_for('home'))
    return render_template('edit.html', movie=movie, form=form)

@app.route('/delete')
def delete():
    movie_id = request.args.get('id')
    movie = Movie.query.get(movie_id)
    db.session.delete(movie)
    db.session.commit()
    return redirect(url_for('home'))`}
                        language="python"
                    />
                </section>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Environment Variables</h4>
                            <p className="text-sm text-surface-400">
                                Store your TMDB API key in an environment variable, never in your code.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Image URLs</h4>
                            <p className="text-sm text-surface-400">
                                TMDB returns partial image paths. Prepend <code>https://image.tmdb.org/t/p/w500</code> to get the full URL.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">get_or_404()</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>Movie.query.get_or_404(id)</code> to automatically return a 404 page if the movie doesn't exist.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
