module TweetsHelper
  def render_with_hashtags(content)
    content.gsub(/[#＃][\w\p{Han}ぁ-ヶｦ-ﾟー]+/){|word| link_to word, "/hashtag/#{word.delete("#")}", data:{'turbolinks': false}}.html_safe
  end
end
